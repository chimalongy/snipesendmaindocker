import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received outbound data:", body);

    const {
      name,
      initialList,
      assignedEmails,
      userId,
    } = body;

    if (!name || !initialList || !assignedEmails || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await TableCreator();

    const existingOutbounds = await db.getOutboundsByUserId(userId);
    const duplicate = existingOutbounds.data?.some(
      (outbound) => outbound.outbound_name === name
    );

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "This outbound name is already registered." },
        { status: 400 }
      );
    }

    const result = await db.registerOutbound(
      userId,
      name,
      JSON.stringify(initialList),
      JSON.stringify([]),
      JSON.stringify(assignedEmails)
    );

    if (!result.success) {
      console.error("Database error during registerOutbound:", result.error || result);
      return NextResponse.json(
        { success: false, message: "Failed to register outbound" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Outbound registered successfully",
      data: result.data,
    });

  } catch (error) {
    console.error("Register Outbound Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
