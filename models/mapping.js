const mongoose = require("mongoose");

const mappingSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  client: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  ],
  Advocate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advocate",
  },
  FirmOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FirmOwner",
    required: true,
  },
  isActive: {
    type: Boolean,
    require: true,
    default: true,
  },
  lastReminderdate: {
    type: Date,
  },
});

const Mapping = mongoose.model("Mapping", mappingSchema);
module.exports = Mapping;
