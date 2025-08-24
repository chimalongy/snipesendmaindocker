// app/api/auth/gmail/callback/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";
import DBFunctions from "@/app/utils/database/DatabaseFunctions";


const db = new DBFunctions();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { message: "Missing authorization code" },
        { status: 400 }
      );
    }
    if (!state) {
      return NextResponse.json(
        { message: "Missing state data" },
        { status: 400 }
      );
    }

    // ✅ Decode the state back into an object
    const stateData = JSON.parse(decodeURIComponent(state));
    const { user_id, sender_name, email_address, sending_capacity, signature } =
      stateData;

    console.log("OAuth State Data:", stateData);

    // ✅ Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  

    // ✅ Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;
    const accessToken = tokens.access_token;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token received" },
        { status: 400 }
      );
    }

    // ✅ Store refresh token and extra info in DB
    await db.saveGmailConnection(
      user_id,
      email_address,
      accessToken,
      refreshToken,
      sender_name,
      signature,
      sending_capacity
    );

    // ✅ Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?gmail_connected=true`
    );
  } catch (error) {
    console.error("Gmail callback error:", error);
    return NextResponse.json(
      { message: "Failed to complete Gmail connection." },
      { status: 500 }
    );
  }
}
