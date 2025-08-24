import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";

const db = new DBFunctions();
console.log("Hitting endpoint")

export async function POST(req) {
    console.log("Hitting endpoint")
  try {
    const body = await req.json();
    console.log(body);

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    // Ensure required tables exist
    await TableCreator();

    const userEmailsResult = await db.getUserEmails(userId);
    if (!userEmailsResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve emails." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email settings retrieved successfully.",
      data: userEmailsResult.data,
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
