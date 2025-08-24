// app/api/auth/gmail/callback/route.js

import { google } from "googleapis";
import { NextResponse } from "next/server";

// Create OAuth2 client with environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // e.g. ""
);



export async function GET(req) {
  try {
    // Extract ?code= from URL
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ 
        success:false,
        message: "Missing authorization code" }, { status: 400 });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });

    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return NextResponse.json({ 
        success:false,
        message: "No refresh token received" }, { status: 400 });
    }


    console.log ("REFRESH TOKEN: "+ refreshToken)
    // Store refresh token in your DB (replace with your DB logic)
    // await db.saveRefreshToken(userId, refreshToken);
    

    // Redirect back to dashboard
    return NextResponse.redirect(new URL("/dashboard?gmail_connected=true", req.url));
  } catch (err) {
    console.error("Error exchanging code for tokens:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
