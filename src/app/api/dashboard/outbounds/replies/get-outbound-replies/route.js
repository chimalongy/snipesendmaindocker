import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";
import { readEmails } from "@/app/utils/readEmails";
import { readBouncedEmails } from "@/app/utils/readBouncedEmails";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    const { outbound_id, subject } = body;
    console.log(subject);

    if (!outbound_id || !subject) {
      return NextResponse.json(
        { success: false, message: "All fields required." },
        { status: 400 }
      );
    }

    await TableCreator();

    const outbound = await db.findOutbound(outbound_id);
    if (!outbound.success) {
      return NextResponse.json(
        { success: false, message: "Outbound not found." },
        { status: 404 }
      );
    }

    const allocations = JSON.parse(outbound.data.list_allocations || "[]");

    // collect results sequentially
    const results = [];

    for (const allocation of allocations) {
      const emailAssigned = allocation.emailAssigned;
      const list = allocation.list;
      const emailSettings = await db.findEmailByemailAddress(emailAssigned);

      if (!emailSettings.success) {
        console.warn(`Skipping ${emailAssigned}: Email settings not found.`);
        results.push([]); // keep alignment
        continue;
      }

      const { access_token, refresh_token } = emailSettings.data;

      console.log(`
        EMAIL address: ${emailAssigned},
        Access token: ${access_token},
        Refresh token: ${refresh_token}
      `);

      // fetch replies for this allocation
      const replies = await readEmails(
        emailAssigned,
        list,
        refresh_token,
        access_token,
        subject
      );

      const bouncedreplies = await readBouncedEmails(
        emailAssigned,
        list,
        refresh_token,
        access_token,
        subject
      )

      results.push(replies);
      results.push(bouncedreplies);
    }

    // flatten replies into single array
    const allreplies = results.flat();

    return NextResponse.json({
      success: true,
      message: "Task(s) scheduled successfully.",
      replies: allreplies,
    });
  } catch (error) {
    console.error("Task scheduling failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
