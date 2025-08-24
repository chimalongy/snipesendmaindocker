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
    const { firstName, lastName, email, password } = body;

    // Validate fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    // Check if user exists
    const userExists = await db.findUser(email);

    if (userExists.success && userExists.data === null) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const userRegistered = await db.registerUser(
        firstName,
        lastName,
        email,
        hashedPassword
      );

      if (userRegistered.success) {
        await emailsender.sendRegistrationCompleteMail(email, firstName)
        return NextResponse.json(
          { message: "User registered successfully." },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { message: "Failed to register user." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
