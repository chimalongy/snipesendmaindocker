import { NextResponse } from "next/server";
import { createSession } from "@/app/utils/sessions";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";
import bcrypt from "bcrypt";
import { TableCreator } from "@/app/utils/database/tableCreator";

const db = new DBFunctions();

export async function POST(request) {
  await TableCreator();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const userExists = await db.findUser(email);

    if (userExists.success && userExists.data !== null) {
      const savedPassword = await bcrypt.compare(password, userExists.data.password);
      console.log("Saved password value:", savedPassword);

      if (savedPassword) {
        const token = await createSession(userExists.data.id);
        let user =  userExists.data;
        delete user.password
        const response = NextResponse.json({ success: true, user: user }, { status: 200 });
        response.cookies.set("session", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 2, 
        });
        return response;
      } else {
        return NextResponse.json(
          { message: "Invalid password", success: false },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
