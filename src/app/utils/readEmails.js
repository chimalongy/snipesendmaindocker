import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";

export async function readEmails(emailAddress, list, app_password, subject) {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user: emailAddress, pass: app_password },
    logger: false
  });

  const filteredEmails = [];

  try {
    await client.connect();
    await client.mailboxOpen("INBOX", { readOnly: true });

    // Find messages by subject
    const messages = await client.search({ subject }, { uid: true });

    for (const uid of messages) {
      // fetch full raw source
      for await (const msg of client.fetch(uid, { source: true, envelope: true })) {
        const parsed = await simpleParser(msg.source);

        const from = parsed.from?.text || "";
        const to = parsed.to?.text || "";
        const date = parsed.date || "";
        const msgSubject = parsed.subject || "";
        const text = parsed.text || "";
        const html = parsed.html || "";

        if (list.some((email) => from.includes(email))) {
          filteredEmails.push({
            id: uid,
            from,
            to,
            subject: msgSubject,
            date,
            plainText: text,
            htmlText: html,
            fullBody: text + "\n\n" + html,
            attachments: parsed.attachments || []
          });
        }
      }
    }

    console.log(`Fetched ${filteredEmails.length} emails for ${emailAddress} with subject "${subject}"`);
    return filteredEmails;
  } catch (err) {
    console.error(`Error reading emails for ${emailAddress}:`, err.message);
    return [];
  } finally {
    await client.logout();
  }
}
