
import pool from "./db";


async function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ Users table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
}
async function createForgotPasswordOTPsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS forgot_password_otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ forgot_password_otps table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating forgot_password_otps table:", error);
  }
}

async function createEmailSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS email_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email_address VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      sender_name VARCHAR(255),
      signature TEXT,
      daily_sending_capacity INTEGER,
      daily_usage INTEGER DEFAULT 0,
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ email_settings table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating email_settings table:", error);
  }
}
async function createEmailSettingsTable2() {
  const query = `
    CREATE TABLE IF NOT EXISTS email_settings_2 (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email_address VARCHAR(255) NOT NULL,
      access_token VARCHAR(255) NOT NULL,
      refresh_token VARCHAR(255) NOT NULL,
      sender_name VARCHAR(255),
      signature TEXT,
      daily_sending_capacity INTEGER,
      daily_usage INTEGER DEFAULT 0,
      last_used TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ email_settings table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating email_settings table:", error);
  }
}






async function createOutboundSettingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS outbound_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      outbound_name VARCHAR(255) NOT NULL,
      initial_email_list TEXT NOT NULL,
      deleted_email_list TEXT NOT NULL,
      list_allocations TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ outbound_settings table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating outbound_settings table:", error);
  }
}

async function createTaskTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      outbound_id INTEGER NOT NULL REFERENCES outbound_settings(id) ON DELETE CASCADE,
      task_name VARCHAR(255) NOT NULL,
      task_type VARCHAR(100) NOT NULL,
      task_subject TEXT NOT NULL,
      task_body TEXT NOT NULL,
      task_schedule_date DATE NOT NULL,
      task_schedule_time TIME NOT NULL,
      task_sending_rate INTEGER NOT NULL,
      task_status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("✅ tasks table created (if not exists).");
  } catch (error) {
    console.error("❌ Error creating tasks table:", error);
  }
}

async function createTaskResultTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS task_results (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      outbound_id INTEGER NOT NULL REFERENCES outbound_settings(id) ON DELETE CASCADE,
      task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      task_name VARCHAR(255) NOT NULL,
      sent_from VARCHAR(255) NOT NULL,
      receiver VARCHAR(255) NOT NULL,
      message_id VARCHAR(255) NOT NULL,
      thread_id TEXT,
      send_result TEXT NOT NULL,
      send_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    console.log("✅ task_results table created (if not exists).");

    // Optionally create a UNIQUE index for message_id if needed
    const indexQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE c.relname = 'idx_task_results_message_id'
            AND n.nspname = 'public'
        ) THEN
          CREATE UNIQUE INDEX idx_task_results_message_id ON task_results(message_id);
        END IF;
      END$$;
    `;
    await client.query(indexQuery);

    client.release();
  } catch (error) {
    console.error("❌ Error creating task_results table:", error.message);
  }
}




 



export async function TableCreator(){
    await createUsersTable();
    await createForgotPasswordOTPsTable();
    await createEmailSettingsTable();
    await createEmailSettingsTable2();
    await  createOutboundSettingsTable();
    await createTaskTable();

    await createTaskResultTable()
}