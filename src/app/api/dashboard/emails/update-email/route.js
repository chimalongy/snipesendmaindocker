import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Update Email Request Body:", body);

    const { formData } = body;

    if (!formData?.emailid) {
      return NextResponse.json(
        { success: false, message: "Email ID is required." },
        { status: 400 }
      );
    }

    // Extract fields to update
    const fieldsToUpdate = {
      sender_name: formData.sender_name?.trim(),
      signature: formData.signature?.trim(),
      daily_sending_capacity: parseInt(formData.daily_sending_capacity, 10),
    };

    // Remove any undefined/null fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => (fieldsToUpdate[key] === undefined || fieldsToUpdate[key] === null) && delete fieldsToUpdate[key]
    );

    const result = await db.updateEmail(formData.emailid, fieldsToUpdate);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to update email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email updated successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Update Email Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
