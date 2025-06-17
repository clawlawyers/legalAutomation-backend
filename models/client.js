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
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    modeOfCommunication: {
      type: String,
      enum: ["Email", "Phone"],
      default: "Email", // Optional: Set a default
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Client", clientSchema);
