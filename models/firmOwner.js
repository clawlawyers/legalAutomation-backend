const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const firmOwnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    advocateBarCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      default: "Uttar Pradesh",
    },
    courtOfPractice: {
      type: String,
      required: true,
      enum: ["District Court", "State High Court", "Superme Court of India"],
    },
    advocates: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Advocate",
      },
    ],
  },
  { timestamps: true }
);

const FirmOwner = mongoose.model("FirmOwner", firmOwnerSchema);

module.exports = FirmOwner;
