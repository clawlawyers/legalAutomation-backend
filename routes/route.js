const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const caseRoute = require("./case");
const advocateRoute = require("./advocate");
const clientRoute = require("./client");
const causeListRoute = require("./causeList");

router.use("/auth", authRoute);
router.use("/case", caseRoute);
router.use("/advocate", advocateRoute);
router.use("/client", clientRoute);

router.use("/causeList", causeListRoute);

module.exports = router;
