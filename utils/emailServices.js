const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  logger: true,
  debug: true,
  secureConnection: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const htmlTemplateForUpcomingHearingNotification_Client = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Next Hearing Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
    .case-details {
      margin: 20px 0;
    }
    .case-details p {
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer {
      font-size: 14px;
      color: #555555;
      margin-top: 30px;
    }
    .highlight {
      color: #1a73e8;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Dear {{name}},</p>

    <p>We hope this message finds you well.</p>

    <p>
      This is to formally inform you that the next hearing for your case has been scheduled.
      Kindly find the case details below:
    </p>

    <div class="case-details">
      <p class="header">Case Details</p>
      <p><strong>CRN No.:</strong> <span class="highlight">{{cnrNum}}</span></p>
      <p><strong>Case No.:</strong> <span class="highlight">{{caseNum}}</span></p>
      <p><strong>Filing No.:</strong> <span class="highlight">{{filingNum}}</span></p>
      <p><strong>Case Type:</strong> <span class="highlight">{{caseType}}</span></p>
      <p><strong>Next Hearing Date:</strong> <span class="highlight">{{nextHearingDate}}</span></p>
      <p><strong>Advocate Assigned:</strong> <span class="highlight">{{advocateName}}</span></p>
    </div>

    <p>
      Kindly make sure you are available on the appointed day. Always use the
      <strong>Claw LegalTech</strong> portal to contact us directly if you need further assistance or inquiries.
    </p>

    <div class="footer">
      <p>At every stage of the legal procedure, we are dedicated to helping you.</p>
      <p>Warm regards,</p>
      <p><strong>Team Claw LegalTech</strong></p>
    </div>
  </div>
</body>
</html>
`;

exports.sendCaseEmailToClient = async (toEmail, caseData) => {
  const templateForPlan = handlebars.compile(
    htmlTemplateForUpcomingHearingNotification_Client
  );

  const htmlContent = templateForPlan(caseData);

  const mailOptions = {
    from: '"Claw LegalTech" <no-reply@clawlegaltech.com>',
    to: toEmail,
    subject: "Next Hearing Notification – Claw LegalTech",
    html: htmlContent, // send HTML template here
  };

  return transporter.sendMail(mailOptions);
};

const htmlTemplateForUpcomingHearingNotification_Advocate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Case Assignment Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
    .case-details {
      margin: 20px 0;
    }
    .case-details p {
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer {
      font-size: 14px;
      color: #555555;
      margin-top: 30px;
    }
    .highlight {
      color: #1a73e8;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Dear Advocate {{name}},</p>

    <p>We hope you are well.</p>

    <p>
      This is to let you know that, based on the details provided below,
      you have been assigned to represent a client at the next hearing:
    </p>

    <div class="case-details">
      <p class="header">Case Details</p>
      <p><strong>CRN No.:</strong> <span class="highlight">{{cnrNum}}</span></p>
      <p><strong>Case No.:</strong> <span class="highlight">{{caseNum}}</span></p>
      <p><strong>Filing No.:</strong> <span class="highlight">{{filingNum}}</span></p>
    <p><strong>Case Type:</strong> <span class="highlight">{{caseType}}</span></p>
      <p><strong>Next Hearing Date:</strong> <span class="highlight">{{nextHearingDate}}</span></p>
      <p><strong>Client Name:</strong> <span class="highlight">{{clientName}}</span></p>
    </div>

    <div class="footer">
      <p>Kindly review the case at your earliest convenience via the Claw LegalTech portal.</p>
      <p>Thank you for your continued support and service.</p>
      <p><strong>Team Claw LegalTech</strong></p>
    </div>
  </div>
</body>
</html>
`;

exports.sendCaseEmailToAdvocate = async (toEmail, caseData) => {
  const templateForPlan = handlebars.compile(
    htmlTemplateForUpcomingHearingNotification_Advocate
  );

  const htmlContent = templateForPlan(caseData);

  const mailOptions = {
    from: '"Claw LegalTech" <no-reply@clawlegaltech.com>',
    to: toEmail,
    subject: "Next Hearing Notification – Claw LegalTech",
    html: htmlContent, // send HTML template here
  };

  return transporter.sendMail(mailOptions);
};

const htmlTemplateForUpcomingHearingDetails = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hearing Update</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header {
        font-size: 18px;
        margin-bottom: 20px;
      }
      .section-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
        text-decoration: underline;
      }
      .footer {
        margin-top: 30px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Dear {{clientName}},</p>

      <p>
        I am writing to provide you with an update regarding the hearing for
        <strong>Case Number: {{caseNum}}</strong> held on
        <strong>Date: {{hearingDate}}</strong> at
        <strong>Court Name: {{courtName}}</strong>. Please find below the
        detailed summary of the proceedings.
      </p>

      <div class="section-title">Hearing Details:</div>
      <p><strong>Advocate:</strong> ADV. {{advocateName}}</p>
      <p><strong>Case Number:</strong> {{caseNum}}</p>
      <p><strong>Hearing Date:</strong> {{hearingDate}}</p>
      <p><strong>Court:</strong> {{courtName}}</p>


      <div class="section-title">Message From Advocate:</div>
      <p>
        "The hearing was conducted. The matter was taken up for {{advocateMessage}}. 
        The court has heard the submissions and the matter
        has been posted."
      </p>

      <p class="footer">
        If you have any questions or need clarification regarding this update,
        feel free to get in touch.
      </p>

      <p>Best Regards,<br />ADV. {{advocateName}}</p>
    </div>
  </body>
</html>
`;

//  requiredObj={
//   advocateName: "",
//   clientName: "",
//   caseNum: "",
//   hearingDate: "",
//   courtName: "",
//   advocateMessage: "",
//  }
exports.sendCaseEmailToClientHearingDetails = async (toEmail, caseData) => {
  const templateForPlan = handlebars.compile(
    htmlTemplateForUpcomingHearingDetails
  );

  const htmlContent = templateForPlan(caseData);

  const mailOptions = {
    from: `"ADV.${caseData.advocateName} " <no-reply@clawlegaltech.com>`,
    to: toEmail,
    subject: `Hearing Update - Case Number ${caseData.caseNum}`,
    html: htmlContent, // send HTML template here
  };

  return transporter.sendMail(mailOptions);
};

const htmlTemplateForUpcomingPaymentReminder = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice for Hearing</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .section-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
        text-decoration: underline;
      }
      .footer {
        margin-top: 30px;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Dear {{clientName}},</p>

      <p>I hope you are doing well.</p>

      <p>
        This is to inform you that the hearing for
        <strong>Case Number: {{caseNum}}</strong> was successfully attended on
        <strong>Date: {{hearingDate}}</strong> at
        <strong>Court Name: {{courtName}}</strong>. Kindly find below the
        details of the professional fee applicable for the hearing.
      </p>

      <div class="section-title">Invoice Details:</div>
      <p><strong>Advocate:</strong> ADV. {{advocateName}}</p>
      <p><strong>Case Number:</strong> {{caseNum}}</p>
      <p><strong>Hearing Date:</strong> {{hearingDate}}</p>
      <p><strong>Court:</strong> {{courtName}}</p>
      <p><strong>Professional Fee for the Hearing:</strong> ₹{{totalAmount}}/-</p>
      <p><strong>Current Due Amount:</strong> ₹{{dueAmount}}/-</p>

      <div class="section-title">Terms:</div>
      <p>
        The mentioned fee covers only the hearing held on <strong>{{hearingDate}}</strong>.
        Any future hearings, filings, or additional legal services will be billed
        separately as per mutually agreed terms.
      </p>
      <p>Kindly complete the payment before the next hearing date for this case.</p>

      <p class="footer">
        Best Regards,<br />
        ADV. {{advocateName}}
      </p>
    </div>
  </body>
</html>
`;

// requiredObj = {
//   advocateName: "",
//   clientName: "",
//   caseNum: "",
//   hearingDate: "",
//   courtName: "",
//   totalAmount: "",
//   dueAmount: "",
// }
exports.sendCaseEmailToClientPaymentReminder = async (toEmail, caseData) => {
  const templateForPlan = handlebars.compile(
    htmlTemplateForUpcomingPaymentReminder
  );

  const htmlContent = templateForPlan(caseData);

  const mailOptions = {
    from: `"ADV.${caseData.advocateName} " <no-reply@clawlegaltech.com>`,
    to: toEmail,
    subject: `Invoice for Hearing - Case Number ${caseData.caseNum}`,
    html: htmlContent, // send HTML template here
  };

  return transporter.sendMail(mailOptions);
};
