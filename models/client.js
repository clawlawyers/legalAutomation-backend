const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    modeOfCommunication: {
      type: String,
      enum: ["Email", "SMS", "Whatsapp"],
      default: "Email", // Optional: Set a default
    },
    firmOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FirmOwner", // Assuming you have a FirmOwner model
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt
  }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
