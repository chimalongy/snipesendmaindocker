import pool from "./db";

export default class DBFunctions {
  async findUser(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return { success: true, data: result.rows[0] || null };
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }

  async registerUser(firstName, lastName, email, hashedPassword) {
    try {
      const insertQuery = `
                INSERT INTO users (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id, first_name, last_name, email, created_at
            `;
      const values = [firstName, lastName, email, hashedPassword];
      const result = await pool.query(insertQuery, values);

      if (result.rows.length === 0) {
        throw new Error("User registration failed");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }

      return { success: false, data: null };
    }
  }

  async registerOTP(email, otp, expiresAt) {
    try {
      const insertQuery = `
            INSERT INTO forgot_password_otps (email, otp, expires_at)
            VALUES ($1, $2, $3)
            RETURNING id, email, otp, expires_at, created_at
        `;
      const values = [email, otp, expiresAt];
      const result = await pool.query(insertQuery, values);

      if (result.rows.length === 0) {
        throw new Error("OTP registration failed");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error registering OTP:", error);
      return { success: false, data: null };
    }
  }

  async verifyOTP(email, otp) {
    try {
      const selectQuery = `
            SELECT * FROM forgot_password_otps
            WHERE email = $1 AND otp = $2 AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT 1
        `;
      const values = [email, otp];
      const result = await pool.query(selectQuery, values);

      if (result.rows.length === 0) {
        return { success: false, message: "Invalid or expired OTP" };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async deleteOTP(email) {
    try {
      const deleteQuery = `
            DELETE FROM forgot_password_otps
            WHERE email = $1
        `;
      await pool.query(deleteQuery, [email]);
      return { success: true };
    } catch (error) {
      console.error("Error deleting OTP:", error);
      return { success: false };
    }
  }

  async updatePasswordByEmail(email, newHashedPassword) {
    try {
      const updateQuery = `
      UPDATE users
      SET password = $1
      WHERE email = $2
      RETURNING id, email
    `;
      const values = [newHashedPassword, email];
      const result = await pool.query(updateQuery, values);

      if (result.rows.length === 0) {
        throw new Error("User not found or password not updated");
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error("Error updating password:", error);
      return { success: false, data: null };
    }
  }


//EMAILS

async registerEmail(userId, emailAddress, password, senderName, signature, dailySendingCapacity) {
  try {
    const insertQuery = `
      INSERT INTO email_settings 
      (user_id, email_address, password, sender_name, signature, daily_sending_capacity)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
    `;
    const values = [userId, emailAddress, password, senderName, signature, dailySendingCapacity];
    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings registration failed");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error registering email settings:", error);
    if (error.code === "23505") {
      throw new Error("Email address already exists");
    }
    return { success: false, data: null };
  }
}

async saveGmailConnection( 
  user_id,
  email_address,
  access_token,
  refresh_token,
  sender_name,
  signature,
  sending_capacity) {
  try {
    const insertQuery = `
      INSERT INTO email_settings_2 
      (user_id, email_address, access_token, refresh_token, sender_name, signature, daily_sending_capacity)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, daily_usage, last_used, created_at
    `;

    const values = [
      user_id,
      email_address,
      access_token,
      refresh_token,
      sender_name,
      signature,
      sending_capacity
    ];

    console.log(values)

    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings registration failed");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error registering email settings:", error);
    if (error.code === "23505") {
      throw new Error("Email address already exists");
    }
    return { success: false, data: null };
  }
}

async deleteEmail(id) {
  try {
    const deleteQuery = `
      DELETE FROM email_settings_2 WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Email settings not found");
    }

    return { success: true, message: "Email settings deleted successfully" };
  } catch (error) {
    console.error("Error deleting email settings:", error);
    return { success: false, message: "Failed to delete email settings" };
  }
}

async updateEmail(id, updateFields) {
  try {
    const keys = Object.keys(updateFields);
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = Object.values(updateFields);
    values.push(id);

    const updateQuery = `
      UPDATE email_settings_2 SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings not found");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error updating email settings:", error);
    return { success: false, data: null };
  }
}



async getUserEmails(userId) {
  try {
    const query = `
      SELECT *
      FROM email_settings_2
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return { success: false, data: null };
  }
}
async getUserEmailsold(userId) {
  try {
    const query = `
      SELECT *
      FROM email_settings
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching user emails:", error);
    return { success: false, data: null };
  }
}

async findEmailById(id) {
  try {
    const query = `
      SELECT id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
      FROM email_settings_2
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { success: false, data: null, message: "Email not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error fetching email by ID:", error);
    return { success: false, data: null, message: "Error fetching email" };
  }
}
async findEmailByemailAddress(email) {
  try {
    const query = `
      SELECT *
      FROM email_settings_2
      WHERE email_address = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return { success: false, data: null, message: "Email not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error fetching email by ID:", error);
    return { success: false, data: null, message: "Error fetching email" };
  }
}
async findEmailByemailAddressOld(email) {
  try {
    const query = `
      SELECT *
      FROM email_settings
      WHERE email_address = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return { success: false, data: null, message: "Email not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error fetching email by ID:", error);
    return { success: false, data: null, message: "Error fetching email" };
  }
}

//outbounds
async registerOutbound(userId, outboundName, initialEmailList, deletedEmailList, listAllocations) {
  try {
    const insertQuery = `
      INSERT INTO outbound_settings 
      (user_id, outbound_name, initial_email_list, deleted_email_list, list_allocations)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, outbound_name, initial_email_list, deleted_email_list, list_allocations, created_at;
    `;

    const values = [
      userId,
      outboundName,
      initialEmailList,
      deletedEmailList, // this will be "[]"
      listAllocations
    ];

    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Outbound registration failed");
    }

    return { success: true, data: result.rows[0] };

  } catch (error) {
    console.error("Error registering outbound:", error);
    return { success: false, data: null };
  }
}


async deleteOutbound(id) {
  try {
    const deleteQuery = `
      DELETE FROM outbound_settings WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Outbound not found");
    }

    return { success: true, message: "Outbound deleted successfully" };
  } catch (error) {
    console.error("Error deleting outbound:", error);
    return { success: false, message: "Failed to delete outbound" };
  }
}

async getOutboundsByUserId(userId) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_name, initial_email_list, 
        deleted_email_list, list_allocations, created_at
      FROM outbound_settings
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(selectQuery, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching outbounds by userId:", error);
    return { success: false, data: [] };
  }
}

async findOutbound(id) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_name, initial_email_list, 
        deleted_email_list, list_allocations, created_at
      FROM outbound_settings
      WHERE id = $1
    `;
    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return { success: false, message: "Outbound setting not found", data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error finding outbound setting:", error);
    return { success: false, data: null };
  }
}

async updateOutboundSettingField(outbound_id, fieldName, newValue) {
  const allowedFields = [
    'user_id',
    'outbound_name',
    'initial_email_list',
    'deleted_email_list',
    'list_allocations'
  ];

  if (!allowedFields.includes(fieldName)) {
    return { success: false, message: `Invalid field name: ${fieldName}`, data: null };
  }

  const query = `
    UPDATE outbound_settings
    SET ${fieldName} = $1
    WHERE id = $2
    RETURNING id, user_id, outbound_name, initial_email_list, 
              deleted_email_list, list_allocations, created_at;
  `;

  try {
    const client = await pool.connect();
    const result = await client.query(query, [newValue, outbound_id]);
    client.release();

    if (result.rowCount === 0) {
      return { success: false, message: "Outbound setting not found", data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error updating outbound setting:", error);
    return { success: false, message: "Error updating outbound setting", data: null };
  }
}




//tasks

//tasks
async registerTask(
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
) {
  try {
    const insertQuery = `
      INSERT INTO tasks 
      (user_id, outbound_id, task_name, task_type, task_subject, task_body, task_schedule_date, task_schedule_time, task_sending_rate, task_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, user_id, outbound_id, task_name, task_type, task_subject, task_body, task_schedule_date, task_schedule_time, task_sending_rate, task_status, created_at;
    `;

    const values = [
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
    ];

    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Task registration failed");
    }

    return { success: true, data: result.rows[0] };

  } catch (error) {
    console.error("Error registering task:", error);
    return { success: false, data: null };
  }
}

async deleteTask(id) {
  try {
    const deleteQuery = `
      DELETE FROM tasks WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      throw new Error("Task not found");
    }

    return { success: true, message: "Task deleted successfully" };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, message: "Failed to delete task" };
  }
}

async getTasksByUserId(userId) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_id, task_name, task_type,
        task_subject, task_body, task_schedule_date, 
        task_schedule_time, task_sending_rate, task_status, created_at
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(selectQuery, [userId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching tasks by userId:", error);
    return { success: false, data: [] };
  }
}

async findTaskByName(userId, outboundId, taskName) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_id, task_name, task_type,
        task_subject, task_body, task_schedule_date, 
        task_schedule_time, task_sending_rate, task_status, created_at
      FROM tasks
      WHERE user_id = $1 AND outbound_id = $2 AND task_name = $3
    `;

    const result = await pool.query(selectQuery, [userId, outboundId, taskName]);

    if (result.rows.length === 0) {
      return { success: false, message: "Task not found", data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("Error finding task:", error);
    return { success: false, data: null };
  }
}



async findTask(id) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_id, task_name, task_type,
        task_subject, task_body, task_schedule_date, 
        task_schedule_time, task_sending_rate, task_status, created_at
      FROM tasks
      WHERE id = $1
    `;
    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return { success: false, message: "Task not found", data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error finding task:", error);
    return { success: false, data: null };
  }
}

async updateEmail(id, updateFields) {
  try {
    const keys = Object.keys(updateFields);
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");
    const values = Object.values(updateFields);
    values.push(id);

    const updateQuery = `
      UPDATE email_settings SET ${setClause}
      WHERE id = $${values.length}
      RETURNING id, user_id, email_address, sender_name, signature, daily_sending_capacity, created_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      throw new Error("Email settings not found");
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Error updating email settings:", error);
    return { success: false, data: null };
  }
}

async getTasksByOutboundId(outboundId) {
  try {
    const selectQuery = `
      SELECT 
        id, user_id, outbound_id, task_name, task_type,
        task_subject, task_body, task_schedule_date, 
        task_schedule_time, task_sending_rate, task_status, created_at
      FROM tasks
      WHERE outbound_id = $1
      ORDER BY created_at DESC;
    `;
    
    const result = await pool.query(selectQuery, [outboundId]);

    return { success: true, data: result.rows };
  } catch (error) {
    console.error("Error fetching tasks by outbound_id:", error);
    return { success: false, data: [] };
  }
}




async  getMessageThreads(list, outbound_id, sender_email) {
  const result = [];

  for (let i = 0; i < list.length; i++) {
    const receiver = list[i];

    const sql = `
      SELECT message_id, thread_id
      FROM task_results 
      WHERE outbound_id = $1 
        AND sent_from = $2 
        AND receiver = $3
    `;

    try {
      const res = await pool.query(sql, [outbound_id, sender_email, receiver]);
      
      // Push an object containing receiver and their message_ids
      result.push({
        receiver,
        message_ids: res.rows.map(row => row.message_id),
        thread_ids: res.rows.map(row => row.thread_id)
      });

    } catch (error) {
      console.error(`Error fetching for receiver ${receiver}:`, error);
    }
  }

  

  return result;
}












}
