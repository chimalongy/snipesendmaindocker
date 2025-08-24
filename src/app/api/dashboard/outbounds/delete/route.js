import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import EmailFunctions from "@/app/utils/email/emailFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";
import axios from "axios";


const db = new DBFunctions();


export async function POST(req) {
    console.log("Hitting outboud delete  endpoint")
  try {
    const body = await req.json();
    console.log(body);

    const { outbound_id} = body;

    if (!outbound_id) {
      return NextResponse.json(
        { success: false, message: "All fields required." },
        { status: 400 }
      );
    }

    // Ensure required tables exist
    await TableCreator();

    const outboundResult = await db.findOutbound(outbound_id);
    //console.log(outboundResult.data)
   
    if (!outboundResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve outbound." },
        { status: 400 }
      );
    }
 let outboundname = outboundResult.data.outbound_name
    let delete_result=  await db.deleteOutbound(outbound_id)
    if (!delete_result.success){
         return NextResponse.json(
        { success: false, message: "Failed to delete outbound." },
        { status: 400 }
      );
    }

    let tasksdelete_response = await axios.post (`${process.env.TASKS_SCHEDULER_WORKER}/delete-outbound-tasks`,{outboundname})
    let tasksdelete_result = tasksdelete_response.data

    if (!tasksdelete_result.success){
           return NextResponse.json(
         { success: false, message: "Failed to delete outbound scheduled tasks." },
         { status: 400 })
    }
    
    console.log(tasksdelete_result)

    return NextResponse.json({
      success: true,
      message: "Outbound Updated",
      data: outboundResult.data,
    });

  } catch (error) {
    console.log("Outbound delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
