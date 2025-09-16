import { google } from "googleapis";


// Recursive helper to extract all body parts
function extractMessageParts(payload, bodies = []) {
  if (!payload) return bodies;

  if (payload.body?.data) {
    const decoded = Buffer.from(payload.body.data, "base64").toString("utf-8");
    bodies.push({
      mimeType: payload.mimeType,
      body: decoded,
    });
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      extractMessageParts(part, bodies);
    }
  }

  return bodies;
}

function findEmailsInText(list, body) {
  const str = body.toLowerCase();
  return list.find(email => str.includes(email.toLowerCase())) || null;
}

export async function readEmails(
  emailAddress,
  list,
  refreshToken,
  accessToken,
  subject
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

    let fetchedEmails = [];
    let nextPageToken = null;

    // Gmail search query: filter by subject
    const searchQuery = `subject:"${subject}"`;

    do {
      const listRes = await gmail.users.messages.list({
        userId: "me",
        maxResults: 200,
        pageToken: nextPageToken || undefined,
        q: searchQuery,
        fields: "messages(id,threadId),nextPageToken",
      });

      const messages = listRes.data.messages || [];

      const messageDetails = await Promise.allSettled(
        messages.map((msg) =>
          gmail.users.messages.get({
            userId: "me",
            id: msg.id,
            format: "full",
          })
        )
      );

      for (const result of messageDetails) {
        if (result.status !== "fulfilled") continue;
        const msgData = result.value.data;

        const payload = msgData.payload;
        const headers = payload.headers || [];

        const from = headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
        const msgSubject = headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
        const date = headers.find((h) => h.name.toLowerCase() === "date")?.value || "";
        const inReplyTo = headers.find((h) => h.name.toLowerCase() === "in-reply-to")?.value || "";
        const messageId = headers.find((h) => h.name.toLowerCase() === "message-id")?.value || "";

        const allBodies = extractMessageParts(payload);
        const plainText = allBodies.find((p) => p.mimeType === "text/plain")?.body || "";
        const htmlText = allBodies.find((p) => p.mimeType === "text/html")?.body || "";
        const fullBody = allBodies
          .map((p) => `\n--- ${p.mimeType} ---\n${p.body}`)
          .join("\n");

        fetchedEmails.push({
          id: msgData.id,
          threadId: msgData.threadId,
          from,
          subject: msgSubject,
          to: emailAddress,
          date,
          plainText,
          htmlText,
          fullBody,
          messageId,
          inReplyTo,
        });
      }

      nextPageToken = listRes.data.nextPageToken;
    } while (nextPageToken);

    console.log(
      `Fetched ${fetchedEmails.length} emails for ${emailAddress} with subject containing "${subject}"`
    );

    // find matches in body against the list
    let filteredEmails = [];
    for (let i = 0; i < fetchedEmails.length; i++) {
      let value = fetchedEmails[i];
      
      if (value.inReplyTo && list.some((email)=>value.from.includes(email))){
        filteredEmails.push(value)
      }
    }

    return filteredEmails;
  } catch (error) {
    console.error(`Error reading emails for ${emailAddress}:`, error.message);
    return [];
  }
}
