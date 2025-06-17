const express = require("express");
const router = express.Router();
const {
  getCauseList,
  getDeatilsCauseList,
} = require("../controllers/causeListController");
router.post("/causeList", getCauseList);
router.post("/causeList/details", getDeatilsCauseList);
module.exports = router;
