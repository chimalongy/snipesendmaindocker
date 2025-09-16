import { NextResponse } from "next/server";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import { TableCreator } from "@/app/utils/database/tableCreator";
import { getISODateFormat } from "@/app/utils/globalfunctions";
import axios from "axios";

const db = new DBFunctions();

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      outboundId,
      taskName,
      taskType,
      taskSubject,
      taskBody,
      taskScheduleDate,
      taskScheduleTime,
      taskSendingRate,
      taskStatus,
      timeZone = "Africa/Lagos", // fallback to Nigeria time if not passed
    } = body;

    // Validate required fields
    const requiredFields = {
      userId,
      outboundId,
      taskName,
      taskType,
      taskSubject,
      taskBody,
      taskScheduleDate,
      taskScheduleTime,
      taskSendingRate,
      taskStatus,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${key}` },
          { status: 400 }
        );
      }
    }

    await TableCreator();

    //check if taskname exisits
    let task_exist_result = await db.findTaskByName(
      userId,
      outboundId,
      taskName
    );
    if (task_exist_result.success) {
      // return NextResponse.json(
      // { success: false, message: "Task name already registered." },
      // { status: 404 }
      //);

      let task_delete_result = await db.deleteTask(
        task_exist_result.data.task_id
      );
      if (task_delete_result.success) {
        console.log("task found and deleted");
      } else {
        console.log(task_delete_result.message);
      }
    }

    const taskreg = await db.registerTask(
      userId,
      outboundId,
      taskName,
      taskType,
      taskSubject,
      taskBody,
      taskScheduleDate,
      taskScheduleTime,
      taskSendingRate,
      taskStatus
    );

    const task_id = taskreg.data?.id;
    if (!task_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve task ID after registration.",
        },
        { status: 500 }
      );
    }

    const outbound = await db.findOutbound(outboundId);
    if (!outbound.success) {
      return NextResponse.json(
        { success: false, message: "Outbound not found." },
        { status: 404 }
      );
    }

    const outboundName = outbound.data.outbound_name;
    const allocations = JSON.parse(outbound.data.list_allocations || "[]");

    // 👇 Generate ISO trigger time using provided timeZone
    const triggerAt = getISODateFormat(
      taskScheduleDate,
      taskScheduleTime,
      timeZone
    );

    const url = `${process.env.TASKS_SCHEDULER_WORKER}/schedule`;
    console.log(url)

    for (let i = 0; i < allocations.length; i++) {
      const emailAssigned = allocations[i].emailAssigned;
      const recipients = allocations[i].list;
      let threads = [];
      console.log("TASKTYPE :" + taskType);

      if (taskType == "followup") {
        threads = await db.getMessageThreads(
          allocations[i].list,
          outboundId,
          emailAssigned
        );
      }
      // console.log("THREADS HERE:");
      // console.log(threads);

      const emailSettings = await db.findEmailByemailAddress(emailAssigned);
      if (!emailSettings.success) {
        console.warn(`Skipping ${emailAssigned}: Email settings not found.`);
        continue;
      }

      const { password, sender_name, signature } = emailSettings.data;

      

      

      const payload = {
        user_id: userId,
        outbound_name: outboundName,
        outbound_id:outboundId,
        task_name: taskName,
        task_id,
        task_type:taskType,
        task_subject:taskSubject,
        task_body:taskBody,
        triggerAt,
        recipients,
        interval: taskSendingRate,
        sender_name: sender_name,
        signature,
        threads,
        sender_email:emailAssigned,
        password:password
       
      };

      



      try {
        const result = await axios.post(url, payload);
        console.log(result.data)
        if (!result.data.success) {
          throw new Error(result.data.message || "Task scheduling failed.");
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        return NextResponse.json(
          {
            success: false,
            message: `Failed to schedule task for ${emailAssigned}: ${message}`,
          },
          { status: 500 }
        );
      }
    } 

    return NextResponse.json({
      success: true,
      message: "Task(s) scheduled successfully.",
      data: allocations,
    });
  } catch (error) {
    console.error("Task scheduling failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
