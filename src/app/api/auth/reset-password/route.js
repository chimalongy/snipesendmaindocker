import { TableCreator } from "@/app/utils/database/tableCreator";
import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";
import bcrypt from "bcrypt"; // ✅ Import bcrypt



const db = new DBFunctions();
const emailsender = new EmailFunctions();

export async function POST(req) {
  try {
    console.log("hitting")
    const body = await req.json();
    const {  email, password } = body;

    // Validate fields
    if (!email || !password ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

     const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const paswordUpdated = await db.updatePasswordByEmail(email, hashedPassword)
    console.log("Password Updated"+paswordUpdated)

    if (paswordUpdated.success) {
  
        return NextResponse.json(
          { message: "Password rest completed." },
          { status: 201 }
        );
      
    } else {
      return NextResponse.json(
        { message: "Unable to Update password." },
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
