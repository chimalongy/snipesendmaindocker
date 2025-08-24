import nodemailer from "nodemailer";

const transaportersettings={
   host: 'smtp.gmail.com',
  port: 465,
  secure: true,
      auth: {
        user: "geniusseodomain@gmail.com", // replace with your email
        pass: "lgnddvhvfvhkopml", // replace with your password or app password
      },
}

export async function sendcompanymail(mailOptions) {
  const transporter = nodemailer.createTransport(transaportersettings);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}


export async function senduserEmail(transaportersettings,mailOptions) {
  const transporter = nodemailer.createTransport(transaportersettings);
 
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}


