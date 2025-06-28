const mongoose = require("mongoose");

const clientPaymentSchema = new mongoose.Schema({
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

  historyDate: {
    type: String,
    required: true,
  },

  totalAmount: {
    type: Number,
    // required: true,
    default: 0,
  },
  dueAmount: {
    type: Number,
    // required: true,
    default: 0,
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const ClientPayment = mongoose.model("ClientPayment", clientPaymentSchema);

module.exports = ClientPayment;
