const express = require("express");
const router = express.Router();
const {
  getCauseList,
  getDeatilsCauseList,
} = require("../controllers/causeListController");

router.post("/list", getCauseList);
router.post("/list/details", getDeatilsCauseList);
module.exports = router;
