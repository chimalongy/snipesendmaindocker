import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // Remove the session cookie
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // Expire the cookie immediately
  });

  // Redirect or send a response
  return NextResponse.json({ message: "Logged out successfully" });
}
