const mongoose = require("mongoose");

const advocateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    default: "Uttar Pradesh",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  advocateBarCode: {
    type: String,
    required: true,
    unique: true,
  },
  courtOfPractice: {
    type: String,
    required: true,
    enum: ["District Court", "State High Court", "Superme Court of India"],
  },
  FirmOwner: {
    type: mongoose.Types.ObjectId,
    ref: "FirmOwner", // Reference to the Firm model
  },
});

const Advocate = mongoose.model("Advocate", advocateSchema);

module.exports = Advocate;
