const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Case",
  },
  advocate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advocate",
  },
  firmOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "FirmOwner",
  },
  hearingDate: {
    type: Date,
    required: true,
  },
  reminderDuration: {
    type: Number, // Number of days before hearing
    required: true,
  },
  modeOfReminder: {
    type: String,
    required: true,
    enum: ["Email", "SMS", "Whatsapp"],
  },
});

const reminder = mongoose.model("Reminder", reminderSchema);
module.exports = reminder;
