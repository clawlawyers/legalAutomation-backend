const express = require("express");
const router = express.Router();
const {
  sendHearingdetails,
  sendPaymentReminder,
} = require("../controllers/alertController");
const { requireAuth } = require("../middleware/requireAuth");

router.post("/sendHearingdetails", sendHearingdetails);
router.post("/sendPaymentReminder", requireAuth, sendPaymentReminder);

module.exports = router;
