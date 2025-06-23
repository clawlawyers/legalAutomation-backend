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
  hearingDate: {
    type: Date,
    required: true,
  },
  reminderDuration: {
    type: Date,
    required: true,
  },
  modeOfReminder: {
    type: String,
    required: true,
    enum: ["Email", "SMS", "Whatsapp"],
  },
});
