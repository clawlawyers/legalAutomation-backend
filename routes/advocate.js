const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { addAdvocate } = require("../controllers/advocateController");
const router = express.Router();

router.post("/add", requireAuth, addAdvocate);

module.exports = router;
