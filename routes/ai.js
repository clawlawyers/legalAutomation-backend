const express = require("express");
const router = express.Router();
const { ehanceWithAI } = require("../controllers/aiController");
const { requireAuth } = require("../middleware/requireAuth");
router.post("/ehanceWithAI", requireAuth, ehanceWithAI);
module.exports = router;
