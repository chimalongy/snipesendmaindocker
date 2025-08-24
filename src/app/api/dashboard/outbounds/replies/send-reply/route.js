import { NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/sendEmail"; // your email sending function
import { TableCreator } from "@/app/utils/database/tableCreator";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      outbound_id,
      recipient,
      message,
      originalMessageId,
      thread_id,
      send_from,
      subject,
    } = body;

    if (
      !outbound_id ||
      !recipient ||
      !message ||
      !originalMessageId ||
      !thread_id ||
      !send_from ||
      !subject
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await TableCreator();

    // Fetch outbound settings from DB
    const outbound = await db.findOutbound(outbound_id);
    if (!outbound.success) {
      return NextResponse.json(
        { success: false, message: "Outbound not found." },
        { status: 404 }
      );
    }

    const emailSettings = await db.findEmailByemailAddress(send_from);
    if (!emailSettings.success) {
      return NextResponse.json(
        { success: false, message: "Email settings not found." },
        { status: 404 }
      );
    }

    const { access_token, refresh_token } = emailSettings.data;

    let MessageThreads = await db.getMessageThreads(
      [recipient],
      outbound_id,
      send_from
    );

    console.log(MessageThreads);

  let main_thread_id = MessageThreads[0].thread_ids[0] ;
let main_message_id = MessageThreads[0].message_ids[0];

console.log("=============SELECTED===================")
console.log(main_message_id)
console.log(main_thread_id)
    // Call the sendEmail function
    const sendResult = await sendEmail({
      senderEmail: send_from,
      recipient,
      message,
      subject,
      originalMessageId,
      thread_id,
      access_token,
      refresh_token, // ← Missing comma was here
      main_thread_id,
      main_message_id,
    });

    if (!sendResult.success) {
      throw new Error(sendResult.message || "Failed to send email");
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully.",
      data: sendResult,
    });
  } catch (error) {
    console.error("Reply sending failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
