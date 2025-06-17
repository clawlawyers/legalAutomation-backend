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
