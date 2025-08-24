import { NextResponse } from "next/server";
import DBFunctions from "../../../../utils/database/DatabaseFunctions";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email_id } = body;

    if (!email_id) {
      return NextResponse.json(
        { success: false, message: "Email ID is required." },
        { status: 400 }
      );
    }

    const result = await db.deleteEmail(email_id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Email Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
