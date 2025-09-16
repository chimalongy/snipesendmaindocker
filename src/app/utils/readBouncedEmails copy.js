import { ImapFlow } from "imapflow";

// Helper: fetch full raw source of a message
async function getMessageBody(client, uid) {
  let raw = "";
  for await (let msg of client.fetch(uid, { source: true })) {
    raw = msg.source.toString("utf8");
  }
  return raw;
}

// Helper: search target emails inside the raw body
function findEmailsInText(list, body) {
  const str = body.toLowerCase();
  return list.find((email) => str.includes(email.toLowerCase())) || null;
}

export async function readBouncedEmails(emailAddress, list, app_password) {
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

    // Open inbox (readonly so we don’t mark messages as seen)
    await client.mailboxOpen("INBOX", { readOnly: true });

    // Search for bounce messages by common subjects/senders
    const searchCriteria = [
      ["FROM", "mailer-daemon"],
      ["FROM", "postmaster"],
      ["FROM", "Mail Delivery Subsystem"],
    ];

    for (const criteria of searchCriteria) {
      let messages = await client.search(criteria, { uid: true });

      for (const uid of messages) {
        // Fetch envelope for metadata
        const msg = await client.fetchOne(uid, {
          envelope: true,
        });

        const envelope = msg.envelope || {};
        const subject = envelope.subject || "";
        const from = envelope.from?.map((f) => f.address).join(", ") || "";
        const date = envelope.date || "";

        // Fetch raw body
        const body = await getMessageBody(client, uid);

        // Check if any of our target addresses are inside the bounce notice
        const foundEmail = findEmailsInText(list, body);

        if (foundEmail) {
          filteredEmails.push({
            id: uid,
            from,
            subject,
            to: emailAddress,
            date,
            body,
            receiver: foundEmail, // the email that bounced
          });
        }
      }
    }

    console.log(
      `Fetched ${filteredEmails.length} bounced emails for ${emailAddress}`
    );

    return filteredEmails;
  } catch (error) {
    console.error(`Error reading emails for ${emailAddress}:`, error.message);
    return [];
  } finally {
    await client.logout();
  }
}
