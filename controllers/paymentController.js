const ClientPayment = require("../models/clientPayments");
const Payment = require("../models/payment");

const setTotalAmount = async (req, res) => {
  try {
    const { client, caseId, advocate, firmOwner, historyDate, totalAmount } =
      req.body;

    const clientPayment = await ClientPayment.create({
      client,
      case: caseId,
      advocate,
      firmOwner,
      historyDate,
      totalAmount,
      dueAmount: totalAmount,
    });

    res.status(201).json(clientPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const updatePayment = async (req, res) => {
//   try {
//     const { paymentId, paymentData } = req.body;

//     if (!paymentId) {
//       return res.status(400).json({ message: "Payment ID is required" });
//     }
//     // const createPayment = await Payment.create({
//     //   amount,
//     //   paymentMethod,
//     // });

//     const updatedPayment = await ClientPayment.findOneAndUpdate(
//       { _id: paymentId },
//       {
//         $set: { payment: createPayment._id },
//         dueAmount: { $subtract: ["$dueAmount", amount] },
//       },
//       { new: true }
//     );

//     if (!updatedPayment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     await createPayment.save();
//     await updatedPayment.save();

//     res.status(200).json(updatedPayment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const updatePayment = async (req, res) => {
  try {
    const { paymentData, paymentId } = req.body;

    if (!Array.isArray(paymentData) || paymentData.length === 0) {
      return res
        .status(400)
        .json({ message: "paymentData must be a non-empty array" });
    }

    const updatedPayments = [];

    for (const data of paymentData) {
      const { amount, paymentMethod } = data;

      if (!amount || !paymentMethod) {
        return res.status(400).json({
          message: "Each item must contain  amount, and paymentMethod",
        });
      }

      const createPayment = await Payment.create({
        amount,
        paymentMethod,
      });

      const updatedPayment = await ClientPayment.findOneAndUpdate(
        { _id: paymentId },
        {
          $push: { payments: createPayment._id },
          $inc: { dueAmount: -amount }, // Subtract the amount
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res
          .status(404)
          .json({ message: `Payment record not found for ID: ${paymentId}` });
      }

      updatedPayments.push(updatedPayment);
    }

    res.status(200).json({
      message: "Payments updated successfully",
      updatedPayments,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPayment = async (req, res) => {
  try {
    const { caseId, client, advocate, firmOwner, historyDate } = req.body;
    const payment = await ClientPayment.findOne({
      historyDate: historyDate,
      case: caseId,
      client,
      advocate,
      firmOwner,
    }).populate("payments");
    if (!payment) {
      return res.status(200).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { setTotalAmount, updatePayment, getPayment };
