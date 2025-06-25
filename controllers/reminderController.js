const Reminder = require("../models/reminders");
const { parseDateString } = require("../utils/util");

const addReminder = async (req, res) => {
  try {
    const { hearingDate, clientId, caseId, reminderDuration, modeOfReminder } =
      req.body;

    let Heardate;

    if (typeof hearingDate === "string") {
      Heardate = parseDateString(hearingDate);
    } else {
      Heardate = hearingDate;
    }

    let addRem;
    if (req.user.type === "manager") {
      addRem = await Reminder.create({
        hearingDate: Heardate,
        client: clientId,
        case: caseId,
        reminderDuration: reminderDuration,
        modeOfReminder: modeOfReminder,
        firmOwner: req.user.user._id,
      });
    } else {
      addRem = await Reminder.create({
        hearingDate: hearingDate,
        client: clientId,
        case: caseId,
        reminderDuration: reminderDuration,
        modeOfReminder: modeOfReminder,
        firmOwner: req.user.user.FirmOwner,
        advocate: req.user.user._id,
      });
    }

    res.status(201).json(addRem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addReminder };
