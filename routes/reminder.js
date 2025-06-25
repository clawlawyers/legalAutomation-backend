const express = require("express");
const router = express.Router();
const { addReminder } = require("../controllers/reminderController");
const { requireAuth } = require("../middleware/requireAuth");

router.post("/addReminder", requireAuth, addReminder);
module.exports = router;
