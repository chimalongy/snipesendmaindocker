import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";


const db = new DBFunctions();


export async function POST(req) {
    console.log("Hitting outboud update  endpoint")
  try {
    const body = await req.json();
    console.log(body);

    const { outbound_id, field_name, field_data } = body;

    if (!outbound_id ||!field_name || !field_data) {
      return NextResponse.json(
        { success: false, message: "All fields required." },
        { status: 400 }
      );
    }

    // Ensure required tables exist
    await TableCreator();

    const outboundResult = await db.findOutbound(outbound_id);
    if (!outboundResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve outbound." },
        { status: 400 }
      );
    }

    let update_result=  await db.updateOutboundSettingField(outbound_id, field_name,field_data)

    if (!update_result.success){
         return NextResponse.json(
        { success: false, message: "Failed to update outbound." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Outbound Updated",
      data: outboundResult.data,
    });

  } catch (error) {
    console.error("Register Email error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
