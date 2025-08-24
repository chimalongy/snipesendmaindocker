

export default class EmailTemplates {
  constructor() {
    this.website_name = "SnipeSend";
    this.website_url = "https://snipesend.com";
    this.support_email = "support@snipesend.com";
    this.logo_url = `${this.website_url}/images/logo.png`;
  }

  globalStyles = `
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f7fa;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 30px;
      }
      .header {
        text-align: center;
        margin-bottom: 25px;
      }
      .logo {
        max-width: 180px;
        margin-bottom: 15px;
      }
      h1 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 16px;
        font-size: 16px;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #4361ee;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 600;
        margin: 20px 0;
      }
      .button:hover {
        background-color: #3a56d4;
      }
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eeeeee;
        font-size: 14px;
        color: #7f8c8d;
        text-align: center;
      }
      .otp-code {
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #4361ee;
        text-align: center;
        margin: 25px 0;
        padding: 10px;
        background-color: #f0f4fe;
        border-radius: 4px;
      }
      .highlight {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 4px;
        border-left: 4px solid #4361ee;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 8px;
      }
      .social-links {
        margin: 15px 0;
      }
      .social-links a {
        margin: 0 8px;
      }
    </style>
  `;

   getFooter(includeSocial = true) {
    return `
    <div class="footer">
      ${includeSocial ? `
      <div class="social-links">
        <a href="${this.website_url}/facebook"><img src="${this.website_url}/images/facebook.png" alt="Facebook" width="24"></a>
        <a href="${this.website_url}/twitter"><img src="${this.website_url}/images/twitter.png" alt="Twitter" width="24"></a>
        <a href="${this.website_url}/linkedin"><img src="${this.website_url}/images/linkedin.png" alt="LinkedIn" width="24"></a>
      </div>
      ` : ''}
      <p>© ${new Date().getFullYear()} ${this.website_name}. All rights reserved.</p>
      <p>
        <a href="${this.website_url}/privacy">Privacy Policy</a> | 
        <a href="${this.website_url}/terms">Terms of Service</a> | 
        <a href="${this.website_url}/unsubscribe">Email Preferences</a>
      </p>
      <p>
        ${this.website_name} - Powerful Email Scheduling Solutions<br>
        ${this.website_url}
      </p>
    </div>
    `;
  }

  registrationCompleteTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      ${this.globalStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
          <h1>Welcome to ${this.website_name}!</h1>
        </div>

        <p>Dear ${userName},</p>

        <p>Thank you for registering with ${this.website_name}, your powerful bulk email scheduling platform. Your account has been successfully created and is ready to use.</p>

        <p>With ${this.website_name}, you can:</p>
        <ul>
          <li>Schedule emails in bulk with precision timing</li>
          <li>Manage multiple campaigns with ease</li>
          <li>Segment your audience for targeted messaging</li>
        </ul>

        <div style="text-align: center;">
          <a href="${this.website_name}/login" class="button">Launch Your First Campaign</a>
        </div>

        <p>If you have any questions, our support team is always ready to help at <a href="mailto:${this.support_email}">${this.support_email}</a>.</p>

        ${this.getFooter()}
      </div>
    </body>
    </html>
    `;
  }

  forgotPasswordOTPTemplate(userName, otpCode, expiryMinutes) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      ${this.globalStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
          <h1>Password Reset Request</h1>
        </div>

        <p>Dear ${userName},</p>

        <p>We received a request to reset your ${this.website_name} account password. Please use the following One-Time Password (OTP) to verify your identity:</p>

        <div class="otp-code">${otpCode}</div>

        <div class="highlight">
          <p><strong>Important:</strong> This OTP will expire in ${expiryMinutes} minutes. For your security, please do not share this code with anyone.</p>
        </div>

        <p>If you didn't request a password reset, please secure your account by changing your password immediately or contact our support team at <a href="mailto:${this.support_email}">${this.support_email}</a>.</p>

        ${this.getFooter(true)}
      </div>
    </body>
    </html>
    `;
  }

  passwordResetTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      ${this.globalStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
          <h1>Password Successfully Updated</h1>
        </div>

        <p>Dear ${userName},</p>

        <p>Your ${this.website_name} account password has been successfully updated. If you made this change, no further action is required.</p>

        <div class="highlight">
          <p><strong>Security Notice:</strong> If you did not initiate this password change, please <a href="mailto:${this.support_email}">contact our support team</a> immediately to secure your account.</p>
        </div>

        <p>We recommend these security best practices:</p>
        <ul>
          <li>Use a strong, unique password that you don't use elsewhere</li>
          <li>Enable two-factor authentication in your account settings</li>
          <li>Regularly update your password every 3-6 months</li>
          <li>Be cautious of phishing attempts</li>
        </ul>

        ${this.getFooter()}
      </div>
    </body>
    </html>
    `;
  }

  campaignScheduledTemplate(userName, campaignName, scheduledTime) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      ${this.globalStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
          <h1>Campaign Scheduled Successfully</h1>
        </div>

        <p>Dear ${userName},</p>

        <p>Your campaign <strong>"${campaignName}"</strong> has been successfully scheduled to send at:</p>

        <div class="highlight" style="text-align: center;">
          <strong>${scheduledTime}</strong>
        </div>

        <p>You can view or modify this campaign at any time before it sends by visiting your <a href="${this.website_url}/dashboard">dashboard</a>.</p>

        <p>Need to make last-minute changes? Our system processes campaigns 15 minutes before send time, giving you flexibility.</p>

        ${this.getFooter()}
      </div>
    </body>
    </html>
    `;
  }

  campaignCompletedTemplate(userName, campaignName, stats) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      ${this.globalStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
          <h1>Campaign Completed: ${campaignName}</h1>
        </div>

        <p>Dear ${userName},</p>

        <p>Your campaign <strong>"${campaignName}"</strong> has completed sending. Here's a quick performance summary:</p>

        <ul>
          <li><strong>Total Emails Sent:</strong> ${stats.sent.toLocaleString()}</li>
          <li><strong>Successfully Delivered:</strong> ${stats.delivered.toLocaleString()} (${Math.round((stats.delivered / stats.sent) * 100)}%)</li>
          <li><strong>Opened:</strong> ${stats.opened.toLocaleString()} (${Math.round((stats.opened / stats.delivered) * 100)}% of delivered)</li>
          ${stats.clicked ? `<li><strong>Clicked:</strong> ${stats.clicked.toLocaleString()} (${Math.round((stats.clicked / stats.opened) * 100)}% of opened)</li>` : ''}
        </ul>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${this.website_url}/reports/${campaignName.replace(/ /g, '-').toLowerCase()}" class="button">View Detailed Analytics</a>
        </div>

        <p>Pro Tip: Use these insights to optimize future campaigns. Try A/B testing different subject lines or send times!</p>

        ${this.getFooter()}
      </div>
    </body>
    </html>
    `;
  }

  emailTestTemplate(userName, emailAddress) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    ${this.globalStyles}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${this.logo_url}" alt="${this.website_name} Logo" class="logo">
        <h1>Email Test Successful</h1>
      </div>

      <p>Dear ${userName},</p>

      <p>This is a test email to confirm that emails from ${this.website_name} are being delivered successfully to <strong>${emailAddress}</strong>.</p>

      <div class="highlight">
        <p><strong>Your email configuration is working correctly!</strong> You can now start sending emails from this address using ${this.website_name}.</p>
      </div>

      <p>If you received this test email, it means:</p>
      <ul>
        <li>Our system can successfully send to your email address</li>
        <li>Your email client is receiving our messages</li>
        <li>You're ready to schedule and send emails</li>
      </ul>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${this.website_url}/dashboard" class="button">Start Sending Emails</a>
      </div>

      <p>If you didn't request this test, please ignore this email or contact our support team at <a href="mailto:${this.support_email}">${this.support_email}</a>.</p>

      ${this.getFooter(false)}
    </div>
  </body>
  </html>
  `;
}

 
}
