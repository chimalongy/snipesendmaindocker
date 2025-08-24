// utils/sendEmail.js
import { google } from "googleapis";


function createOAuth2Client(accessToken, refreshToken) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
 

  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oAuth2Client;
}

export async function sendEmail({
  senderEmail,
  senderName,
  recipient,
  message,
  subject,
  access_token,
  refresh_token,
  main_thread_id,
  main_message_id,
}) {
  try {
    // Create OAuth2 client
    const oAuth2Client = createOAuth2Client(access_token, refresh_token);

    // Ensure access token is fresh
    const newToken = await oAuth2Client.getAccessToken();
    if (newToken?.token) {
      oAuth2Client.setCredentials({
        access_token: newToken.token,
        refresh_token,
      });
    }

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    let emailContent;
    const formattedBody = message.replace(/\n/g, "<br>");

    // Reply to existing thread
    if (main_message_id && main_thread_id) {
      const original = await gmail.users.messages.get({
        userId: "me",
        id: main_message_id,
        format: "metadata",
        metadataHeaders: ["Message-Id", "Subject"],
      });

      const headers = original.data.payload.headers;
      const messageIdHeader = headers.find((h) => h.name === "Message-Id")?.value;
      let originalSubject = headers.find((h) => h.name === "Subject")?.value || subject;

      if (!/^Re:/i.test(originalSubject)) {
        originalSubject = `Re: ${originalSubject}`;
      }

      if (!messageIdHeader) {
        throw new Error("Could not find Message-Id header from original email");
      }

      emailContent = [
        `From: ${senderName || senderEmail} <${senderEmail}>`,
        `To: ${recipient}`,
        `Subject: ${originalSubject}`,
        `In-Reply-To: ${messageIdHeader}`,
        `References: ${messageIdHeader}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        `<!DOCTYPE html>
<html>
  <body>
    ${formattedBody}
  </body>
</html>`,
      ].join("\n");
    } 
    // New email (not reply)
    else {
      emailContent = [
        `From: ${senderName || senderEmail} <${senderEmail}>`,
        `To: ${recipient}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        `<!DOCTYPE html>
<html>
  <body>
    ${formattedBody}
  </body>
</html>`,
      ].join("\n");
    }

    // Encode Base64URL
    const rawMessage = Buffer.from(emailContent, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const requestBody = { raw: rawMessage };
    if (main_message_id && main_thread_id) {
      requestBody.threadId = main_thread_id;
    }

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody,
    });

    console.log("Email sent:", response.data.id);

    return {
      success: true,
      message: "Email sent successfully.",
      data: {
        messageId: response.data.id,
        threadId: response.data.threadId,
      },
    };
  } catch (error) {
    console.error(`Failed to send email to ${recipient}:`, error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
}
