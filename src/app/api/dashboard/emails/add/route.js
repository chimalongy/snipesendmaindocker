import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";

import bcrypt from "bcrypt"; // ✅ Import bcrypt
import { TableCreator } from "@/app/utils/database/tableCreator";

const db = new DBFunctions();
const emailsender = new EmailFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      senderName,
      emailAddress,
      appPassword,
      sendingCapacity,
      signature,
      userId, // <-- Make sure you receive or get this securely
    } = body;

    // Validate required fields
    if (
      !userId ||
      !senderName ||
      !emailAddress ||
      !appPassword ||
      sendingCapacity === undefined ||
      !signature
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    //check if user has this email befre

    let useremailsresult = await db.getUserEmails(userId);
    let useremails = useremailsresult.data;
    console.log("USER EMAILS" + JSON.stringify(useremails));

    let emailexists = useremails.some(
      (uemail) => uemail.email_address == emailAddress
    );

    console.log(emailexists);

    if (emailexists) {
      return NextResponse.json(
        { success: false, message: "This email already registered." },
        { status: 400 }
      );
    }

    // teste email sending

    const transaportersettings = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailAddress, // replace with your email
        pass: appPassword, // replace with your password or app password
      },
    };

    let testresult = await  emailsender.sendTestEmail(emailAddress, senderName, transaportersettings);

    if (!testresult.success){
         return NextResponse.json(
        { success: false, message: "Failed to connect to this email address." },
        { status: 400 }
      );
    }


    // Register email in DB
    const result = await db.registerEmail(
      userId,
      emailAddress,
      appPassword,
      senderName,
      signature,
      sendingCapacity
    );

    console.log(result);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to register email settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email settings registered successfully",
      data: result.data,
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
