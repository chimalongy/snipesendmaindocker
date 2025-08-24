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
    const {  email, otp } = body;

    // Validate fields
    if (!email || !otp ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    // Check if user exists
    const otpverified = await db.verifyOTP(email, otp);
    console.log(otpverified)

    if (otpverified.success) {
  
        return NextResponse.json(
          { message: "OTP verified." },
          { status: 201 }
        );
      
    } else {
      return NextResponse.json(
        { message: "Invalid One Time Password" },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("OTP verificaion error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
