const express = require("express");
const router = express.Router();
const {
  addReminder,
  casesWithReminder,
} = require("../controllers/reminderController");
const { requireAuth } = require("../middleware/requireAuth");

router.post("/addReminder", requireAuth, addReminder);

router.post("/casesWithReminder", requireAuth, casesWithReminder);
module.exports = router;
