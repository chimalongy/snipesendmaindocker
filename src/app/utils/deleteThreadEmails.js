import { google } from "googleapis";


export async function deleteThreadEmails(
  emailAddress,
  threadId,
  refreshToken,
  accessToken
) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
   

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Get all messages in the thread
    const thread = await gmail.users.threads.get({
      userId: emailAddress || "me",
      id: threadId,
    });

    if (!thread.data.messages || thread.data.messages.length === 0) {
      return { success: false, message: "No messages found in this thread." };
    }

    // Delete each message in the thread
    for (const msg of thread.data.messages) {
      await gmail.users.messages.delete({
        userId: emailAddress || "me",
        id: msg.id,
      });
      console.log(`Deleted message with ID: ${msg.id}`);
    }

    return { success: true, message: `All emails in thread ${threadId} deleted.` };
  } catch (error) {
    console.error("Error deleting thread emails:", error.message);
    return { success: false, error: error.message };
  }
}
