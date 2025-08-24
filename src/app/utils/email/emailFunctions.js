import { sendcompanymail, senduserEmail } from "./emailengine";
import EmailTemplates from "./emailTemplates";

let templates = new EmailTemplates();
let senderEmail = "geniusseodomains@gmail.com";
let website_name = "SnipeSend";
let sender_name ="Chima"

export default class EmailFunctions {
  async sendRegistrationCompleteMail(email, first_name) {
    let template = templates.registrationCompleteTemplate(first_name);
    let mailOptions = {
      from: `${sender_name} <${senderEmail}>`, // Name + email
      to: email,
      subject: `Welcome to ${website_name}`,
      html: template,
    };
    await sendcompanymail(mailOptions);
  }
  async sendForgotPasswordOTP(email, first_name, Otp) {
    let template = templates.forgotPasswordOTPTemplate(first_name,Otp, 15);
    let mailOptions = {
      from: `${sender_name} | <${senderEmail}>`, // Name + email
      to: email,
      subject: `Recover your account`,
      html: template,
    };
    await sendcompanymail(mailOptions);
  }


   async sendTestEmail(email, first_name, transaportersettings) {
    let template = templates.emailTestTemplate(first_name, email)
    let mailOptions = {
      from: `${website_name}<${senderEmail}>`, // Name + email
      to: email,
      subject: `Email Added`,
      html: template,
    };

   let result  = await senduserEmail(transaportersettings,mailOptions);
   return result;
  }


}
