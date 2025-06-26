const Reminder = require("../models/reminders");

const sendNotification = async (reminder) => {
  console.log("Notification Sended");
  // logic to send notification
};

const checkReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // exclusive range

  const reminders = await Reminder.find({})
    .populate("client")
    .populate("case")
    .populate("firmOwner")
    .populate("advocate");

  for (const reminder of reminders) {
    const notifyDate = new Date(reminder.hearingDate);
    notifyDate.setDate(notifyDate.getDate() - reminder.reminderDuration);
    notifyDate.setHours(0, 0, 0, 0); // normalize to date-only

    if (notifyDate.getTime() === today.getTime()) {
      await sendNotification(reminder);
    }
  }
};

module.exports = { checkReminders };
