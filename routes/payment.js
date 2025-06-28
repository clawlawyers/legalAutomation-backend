const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/requireAuth");

const {
  getPayment,
  updatePayment,
  setTotalAmount,
} = require("../controllers/paymentController");

router.post("/getPayment", requireAuth, getPayment);
router.post("/updatePayment", requireAuth, updatePayment);
router.post("/setTotalAmount", requireAuth, setTotalAmount);

module.exports = router;
