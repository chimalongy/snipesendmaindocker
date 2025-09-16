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
    logger: false, // silence logs
  });

  let filteredEmails = [];

  try {
    await client.connect();
    await client.mailboxOpen("INBOX", { readOnly: true });

    // Search messages with matching subject
    let messages = await client.search({ subject: subject }, { uid: true });

    for (const uid of messages) {
      // fetch metadata + structure
      const msg = await client.fetchOne(uid, {
        envelope: true,
        bodyStructure: true,
        bodyParts: ["text"], // try text first
      });

      const envelope = msg.envelope || {};
      const from = envelope.from?.map((f) => f.address).join(", ") || "";
      const date = envelope.date || "";
      const msgSubject = envelope.subject || "";

      let plainText = "";
      let htmlText = "";

      // 1. Try to read text parts
      if (msg.bodyParts) {
        for (const [key, part] of Object.entries(msg.bodyParts)) {
          if (part.mimeType === "text/plain") {
            plainText = part.content.toString("utf8");
          } else if (part.mimeType === "text/html") {
            htmlText = part.content.toString("utf8");
          }
        }
      }

      // 2. If still empty, fallback to raw source
      if (!plainText && !htmlText) {
        for await (let rawMsg of client.fetch(uid, { source: true })) {
          const rawSource = rawMsg.source.toString("utf8");
          plainText = rawSource; // keep full raw
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
