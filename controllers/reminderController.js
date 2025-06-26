const Reminder = require("../models/reminders");
const { parseDateString } = require("../utils/util");

// const addReminder = async (req, res) => {
//   try {
//     const { hearingDate, clientId, caseId, reminderDuration, modeOfReminder } =
//       req.body;

//     let Heardate;

//     if (typeof hearingDate === "string") {
//       Heardate = parseDateString(hearingDate);
//     } else {
//       Heardate = hearingDate;
//     }

//     let addRem;
//     if (req.user.type === "manager") {
//       addRem = await Reminder.create({
//         hearingDate: Heardate,
//         client: clientId,
//         case: caseId,
//         reminderDuration: reminderDuration,
//         modeOfReminder: modeOfReminder,
//         firmOwner: req.user.user._id,
//       });
//     } else {
//       addRem = await Reminder.create({
//         hearingDate: hearingDate,
//         client: clientId,
//         case: caseId,
//         reminderDuration: reminderDuration,
//         modeOfReminder: modeOfReminder,
//         firmOwner: req.user.user.FirmOwner,
//         advocate: req.user.user._id,
//       });
//     }

//     res.status(201).json(addRem);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const addReminder = async (req, res) => {
//   try {
//     const { hearingDate, clientId, caseId, reminderDuration, modeOfReminder } =
//       req.body;

//     console.log(req.user);

//     const Heardate =
//       typeof hearingDate === "string"
//         ? parseDateString(hearingDate)
//         : hearingDate;

//     const reminders = [];

//     for (let client of clientId) {
//       const reminderData = {
//         hearingDate: Heardate,
//         client: client,
//         case: caseId,
//         reminderDuration,
//         modeOfReminder,
//         firmOwner:
//           req.user.type === "manager"
//             ? req.user.user._id
//             : req.user.user.FirmOwner,
//       };

//       if (req.user.type !== "manager") {
//         reminderData.advocate = req.user.user._id;
//       }

//       const createdReminder = await Reminder.create(reminderData);
//       reminders.push(createdReminder);
//     }

//     res.status(201).json(reminders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const addReminder = async (req, res) => {
  try {
    const { hearingDate, clientId, caseId, reminderDuration, modeOfReminder } =
      req.body;

    console.log(req.body);

    const Heardate =
      typeof hearingDate === "string"
        ? parseDateString(hearingDate)
        : hearingDate;

    const reminders = [];

    for (let client of clientId) {
      for (let duration of reminderDuration) {
        for (let mode of modeOfReminder) {
          const reminderData = {
            hearingDate: Heardate,
            client: client,
            case: caseId,
            reminderDuration: duration,
            modeOfReminder: mode,
            firmOwner:
              req.user.type === "manager"
                ? req.user.user._id
                : req.user.user.FirmOwner,
          };

          if (req.user.type !== "manager") {
            reminderData.advocate = req.user.user._id;
          }

          const createdReminder = await Reminder.create(reminderData);
          reminders.push(createdReminder);
        }
      }
    }

    res.status(201).json(reminders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const casesWithReminder = async (req, res) => {
//   try {
//     let reminders;

//     if (req.user.type === "manager") {
//       reminders = await Reminder.find({
//         firmOwner: req.user.user._id,
//       }).populate("case");
//     } else {
//       reminders = await Reminder.find({
//         advocate: req.user.user._id,
//         firmOwner: req.user.user.FirmOwner,
//       }).populate("case");
//     }

//     // Extract unique cases
//     const caseMap = new Map();

//     for (let reminder of reminders) {
//       const caseId = reminder.case?._id?.toString();
//       if (caseId && !caseMap.has(caseId)) {
//         caseMap.set(caseId, reminder.case);
//       }
//     }

//     const uniqueCases = Array.from(caseMap.values());

//     res.status(200).json(uniqueCases);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const casesWithReminder = async (req, res) => {
  try {
    let reminders;

    if (req.user.type === "manager") {
      reminders = await Reminder.find({ firmOwner: req.user.user._id })
        .populate("case")
        .populate("client");
    } else {
      reminders = await Reminder.find({
        advocate: req.user.user._id,
        firmOwner: req.user.user.FirmOwner,
      })
        .populate("case")
        .populate("client");
    }

    const caseMap = new Map();

    for (let reminder of reminders) {
      const caseId = reminder.case?._id?.toString();
      if (!caseId) continue;

      if (!caseMap.has(caseId)) {
        caseMap.set(caseId, {
          case: reminder.case,
          clients: new Map(), // use Map to prevent duplicate clients
        });
      }

      // Add client to set to avoid duplicates
      const entry = caseMap.get(caseId);
      const clientId = reminder.client?._id?.toString();
      if (clientId && !entry.clients.has(clientId)) {
        entry.clients.set(clientId, reminder.client);
      }
    }

    // Convert Map structure to final array with client arrays
    const result = Array.from(caseMap.values()).map((entry) => ({
      case: entry.case,
      clients: Array.from(entry.clients.values()),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addReminder, casesWithReminder };
