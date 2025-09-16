import { ImapFlow } from "imapflow";

export async function readEmails(emailAddress, list, app_password, subject) {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: emailAddress,
      pass: app_password, // Gmail App Password
    },
    logger: null, // silence logs
  });

  let filteredEmails = [];

  try {
    await client.connect();
    await client.mailboxOpen("INBOX", { readOnly: true });

    // Search messages with matching subject
    let messages = await client.search({ subject: subject }, { uid: true });

    for (const uid of messages) {
      // ✅ fetch envelope + all text parts
      const msg = await client.fetchOne(uid, {
        envelope: true,
        bodyParts: ["text"], // special key: includes text/plain + text/html
      });

      const envelope = msg.envelope || {};
      const from = envelope.from?.map((f) => f.address).join(", ") || "";
      const date = envelope.date || "";
      const msgSubject = envelope.subject || "";

      let plainText = "";
      let htmlText = "";

      // `msg.bodyParts` will contain plain and/or HTML parts
      for (const [key, part] of Object.entries(msg.bodyParts || {})) {
        if (part.mimeType === "text/plain") {
          plainText = part.content.toString("utf8");
        } else if (part.mimeType === "text/html") {
          htmlText = part.content.toString("utf8");
        }
      }

      const fullBody = `${plainText}\n\n${htmlText}`;

      // Only keep if "from" matches something in the list
      if (list.some((email) => from.includes(email))) {
        filteredEmails.push({
          id: uid,
          from,
          subject: msgSubject,
          to: emailAddress,
          date,
          plainText,
          htmlText,
          fullBody,
        });
      }
    }

    console.log(
      `Fetched ${filteredEmails.length} emails for ${emailAddress} with subject "${subject}"`
    );

    return filteredEmails;
  } catch (error) {
    console.error(`Error reading emails for ${emailAddress}:`, error.message);
    return [];
  } finally {
    await client.logout();
  }
}
