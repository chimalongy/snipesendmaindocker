import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    const { outbound_id } = body;

    console.log("NEW ALL TASK REQUESTl "+ outbound_id)

    if (!outbound_id) {
      return NextResponse.json(
        { success: false, message: "Missing outbound ID" },
        { status: 400 }
      );
    }

    const result = await db.getTasksByOutboundId(outbound_id);

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching tasks by outboundId:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
