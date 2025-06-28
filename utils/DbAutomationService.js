const Mapping = require("../models/mapping");
const Reminder = require("../models/reminders");
const {
  sendCaseEmailToClient,
  sendCaseEmailToAdvocate,
} = require("./emailServices");
const sendWhatsAppMessage = require("./whatsappServices");

const sendNotification = async (reminder) => {
  console.log("Notification Sended");
  // logic to send notification
  console.log(reminder);
  const casedata = {
    caseNum: reminder.case.caseNum,
    nextHearingDate: reminder.case.nextHearingDate,
    cnrNum: reminder.case.crnNum,
    caseType: reminder.case.caseType,
    filingNum: reminder.case.filingNum,
    advocateName: reminder?.firmOwner
      ? reminder.firmOwner.name
      : reminder.advocate.name,
    name: reminder.client.clientName,
  };
  console.log(casedata);
  if (reminder.modeOfReminder === "Email") {
    // await sendCaseEmailToClient(reminder.client.email, casedata);
  } else if (reminder.modeOfReminder === "Whatsapp") {
    const whatAppData = {
      phone: reminder.client.phone,
      name: reminder.client.clientName,
      templateName: "case_remainder",
      data: [
        reminder.client.clientName,
        casedata.nextHearingDate,
        casedata.caseNum,
        casedata.advocateName,
      ],
    };
    // await sendWhatsAppMessage(whatAppData);
  }
};

const checkReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // exclusive range

  console.log(today, tomorrow);

  const reminders = await Reminder.find({})
    .populate("client")
    .populate("case")
    .populate("firmOwner")
    .populate("advocate");

  // console.log(reminders);

  for (const reminder of reminders) {
    const notifyDate = new Date(reminder.hearingDate);
    notifyDate.setDate(notifyDate.getDate() - reminder.reminderDuration);
    notifyDate.setHours(0, 0, 0, 0); // normalize to date-only

    console.log(notifyDate, today);

    if (notifyDate.getTime() === today.getTime()) {
      await sendNotification(reminder);
    }
  }
};

const sendNextHeringReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    console.log(today);

    // Step 1: Find all mappings with populated case and clients
    const mappings = await Mapping.find()
      .populate("case")
      .populate("client")
      .populate("FirmOwner")
      .populate("Advocate");

    // Step 2: Filter mappings where case.nextHearingDate === today
    const mappingsToday = mappings.filter((map) => {
      const nextHearingDate = map.case?.nextHearingDate;
      console.log(nextHearingDate);
      const cleaned = nextHearingDate?.replace(/(\d+)(st|nd|rd|th)/, "$1");
      const date = new Date(cleaned);
      date.setHours(0, 0, 0, 0);
      console.log(date);
      console.log(today);
      return date && date.getTime() === today.getTime();
    });

    // Step 3: Notify clients
    for (const map of mappingsToday) {
      console.log(map);
      const {
        client,
        case: caseData,
        FirmOwner: firmOwner,
        Advocate: advocate,
      } = map;
      for (const c of client) {
        console.log(firmOwner);
        console.log(c);
        console.log(advocate);
        console.log(caseData);

        const casedataClient = {
          cnrNum: caseData.crnNum,
          caseNum: caseData.caseNum,
          nextHearingDate: caseData.nextHearingDate,
          caseType: caseData.caseType,
          filingNum: caseData.filingNum,
          advocateName: advocate ? advocate.name : firmOwner.name,
          name: c.clientName,
        };

        if (c.modeOfCommunication === "Email") {
          await sendCaseEmailToClient(c.email, casedataClient);
        } else if (c.modeOfCommunication === "Whatsapp") {
          const whatAppData = {
            phone: c.phone,
            name: c.clientName,
            templateName: "case_remainder",
            data: [
              c.clientName,
              caseData.nextHearingDate,
              caseData.caseNum,
              advocate ? advocate.name : firmOwner.name,
            ],
          };
          await sendWhatsAppMessage(whatAppData);
        }

        // For advocate

        const casedataAdvocate = {
          caseNum: caseData.caseNum,
          nextHearingDate: caseData.nextHearingDate,
          cnrNum: caseData.crnNum,
          caseType: caseData.caseType,
          filingNum: caseData.filingNum,
          name: advocate ? advocate.name : firmOwner.name,
          clientName: c.clientName,
        };
        await sendCaseEmailToAdvocate(
          advocate ? advocate.email : firmOwner.email,
          casedataAdvocate
        );
        const whatAppData = {
          phone: advocate ? advocate.phone : firmOwner.phoneNumber,
          name: advocate ? advocate.name : firmOwner.name,
          templateName: "advocate_remainder",
          data: [
            advocate ? advocate.name : firmOwner.name,
            caseData.nextHearingDate,
            caseData.caseNum,
            c.clientName,
          ],
        };
        await sendWhatsAppMessage(whatAppData);
      }
    }

    console.log(
      `✅ Notifications sent for ${mappingsToday.length} cases on ${today}`
    );
  } catch (error) {
    console.error("❌ Error in checkAndNotifyClients:", error.message);
  }
};

module.exports = { checkReminders, sendNextHeringReminders };
