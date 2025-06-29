const {
  sendCaseEmailToClientHearingDetails,
  sendCaseEmailToClientPaymentReminder,
} = require("../utils/emailServices");
const sendWhatsAppMessage = require("../utils/whatsappServices");

const sendHearingdetails = async (req, res) => {
  try {
    const {
      via,
      hearingDate,
      advocateMessage,
      advocateName,
      caseNum,
      courtName,
      clients,
    } = req.body;

    if (!Array.isArray(clients) || clients.length === 0) {
      return res.status(400).json({
        message: "Clients array is required and should not be empty.",
      });
    }

    for (const client of clients) {
      const emailData = {
        advocateName,
        clientName: client.clientName,
        caseNum,
        hearingDate,
        courtName,
        advocateMessage,
      };

      if (via === "email") {
        await sendCaseEmailToClientHearingDetails(
          "shubham528prajapati@gmail.com",
          emailData
        );
      } else {
        const whatsappData = [
          caseNum,
          hearingDate,
          courtName,
          advocateMessage,
          advocateName,
        ];

        //         phone,
        // name,
        // templateName,
        // data,
        const WhatsappPayload = {
          // phone: 9027640571,
          phone: client.phone,
          name: client.clientName,
          templateName: "hearing_details_2",
          data: whatsappData,
        };
        await sendWhatsAppMessage(WhatsappPayload);
      }
    }

    res.status(200).json({
      message: `${
        via === "email" ? "Emails" : "WhatsApp messages"
      } sent successfully.`,
    });
  } catch (error) {
    console.error("Error sending hearing details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendPaymentReminder = async (req, res) => {
  try {
    const { caseNum, hearingDate, courtName, totalAmount, dueAmount, client } =
      req.body;
    if (client.modeOfCommunication === "Email") {
      const emailData = {
        clientName: client.clientName,
        caseNum: caseNum,
        hearingDate: hearingDate,
        courtName: courtName,
        totalAmount: totalAmount,
        dueAmount: dueAmount,
        advocateName: req.user.user.name,
      };
      const data = await sendCaseEmailToClientPaymentReminder(
        client.email,
        emailData
      );
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      const data = [
        caseNum,
        hearingDate,
        courtName,
        totalAmount,
        dueAmount,
        client.clientName,
      ];
      const WhatsappPayload = {
        phone: client.phone,
        name: client.clientName,
        templateName: "payment_reminder",
        data,
      };
      const data1 = await sendWhatsAppMessage(WhatsappPayload);
      res.status(200).json({ message: "Email sent successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendHearingdetails, sendPaymentReminder };
