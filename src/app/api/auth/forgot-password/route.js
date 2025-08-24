import { TableCreator } from "@/app/utils/database/tableCreator";
import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";

import bcrypt from "bcrypt"; // ✅ Import bcrypt

const db = new DBFunctions();
const emailsender = new EmailFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    console.log(otp);

    // Validate fields
    if (!email || !otp) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    // Check if user exists
    const userExists = await db.findUser(email);

    if (userExists.success && userExists.data !== null) {
      console.log(userExists.data);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      let otpregistered = await db.registerOTP(
        userExists.data.email,
        otp,
        expiresAt
      );

      if (otpregistered.success) {
        await emailsender.sendForgotPasswordOTP(
          userExists.data.email,
          userExists.data.first_name,
          otp
        );
        return NextResponse.json({ message: "OTP sent." }, { status: 201 });
      } else {
        return NextResponse.json(
          { message: "Failed to send OTP." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "This email is not registered." },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("Forgot Password error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
