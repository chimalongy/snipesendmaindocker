import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";
import { deleteThreadEmails } from "@/app/utils/deleteThreadEmails";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body)
    const { outbound_id, email_to_remove, emailassigned, member_detail } = body;

    // ✅ Parameter validation
    if (!outbound_id || !email_to_remove || !emailassigned) {
      return NextResponse.json(
        {
          success: false,
          message: "outbound_id, email_to_remove, and emailassigned are required.",
        },
        { status: 400 }
      );
    }

    // ✅ Ensure DB tables exist
    await TableCreator();

    // ✅ Find outbound
    const outbound = await db.findOutbound(outbound_id);
    if (!outbound.success) {
      return NextResponse.json(
        { success: false, message: "Outbound not found." },
        { status: 404 }
      );
    }

    // ✅ Parse allocations
    const allocations = JSON.parse(outbound.data.list_allocations || "[]");

    // ✅ Get the allocation to edit
    const allocation_to_edit = allocations.find(
      (alloc) => alloc.emailAssigned === emailassigned
    );
    if (!allocation_to_edit) {
      return NextResponse.json(
        { success: false, message: "Email assigned not found." },
        { status: 404 }
      );
    }

    // ✅ Check if email exists in the list
    const email_exist = allocation_to_edit.list.some(
      (email) => email.trim().toLowerCase() === email_to_remove.trim().toLowerCase()
    );
    if (!email_exist) {
      return NextResponse.json(
        { success: false, message: "Email not found in list." },
        { status: 404 }
      );
    }

    // ✅ Remove email & update count
    allocation_to_edit.list = allocation_to_edit.list.filter(
      (email) => email.trim().toLowerCase() !== email_to_remove.trim().toLowerCase()
    );
    allocation_to_edit.count = allocation_to_edit.count - 1;

    // ✅ Save updated allocations to DB
    const updated_allocations = JSON.stringify(allocations);
    const update_result = await db.updateOutboundSettingField(
      outbound_id,
      "list_allocations",
      updated_allocations
    );

    if (!update_result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to update allocation list." },
        { status: 400 }
      );
    }

    // ✅ Update deleted email list safely
    let deleted_list = JSON.parse(outbound.deleted_email_list || "[]");
    deleted_list.push(email_to_remove);

    const update_result2 = await db.updateOutboundSettingField(
      outbound_id,
      "deleted_email_list",
      JSON.stringify(deleted_list)
    );

    if (!update_result2.success) {
      return NextResponse.json(
        { success: false, message: "Failed to update deleted email list." },
        { status: 400 }
      );
    }

    // //deleting from gmail

    //  member_detail = JSON.parse(member_detail)
    //   const emailSettings = await db.findEmailByemailAddress(emailassigned);

    //   if (!emailSettings.success) {
    //     return NextResponse.json(
    //     { success: false, message: "Failed to get email assigned details." },
    //     { status: 400 }
    //   );
    //   }

    //   const { access_token, refresh_token } = emailSettings.data;

    // let result = await deleteThreadEmails(emailassigned,member_detail.thread_id,refresh_token,access_token)




    return NextResponse.json({
      success: true,
      message: `Enduser ${email_to_remove} removed successfully.`,
      updated_allocation: allocation_to_edit,
    });

  } catch (error) {
    console.error("Error deleting outbound member:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
