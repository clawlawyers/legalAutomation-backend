const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const caseRoute = require("./case");
const advocateRoute = require("./advocate");
const clientRoute = require("./client");
const causeListRoute = require("./causeList");
const reminderRoute = require("./reminder");
const paymentRoute = require("./payment");
const ai = require("./ai");

router.use("/auth", authRoute);
router.use("/case", caseRoute);
router.use("/advocate", advocateRoute);
router.use("/client", clientRoute);
router.use("/causeList", causeListRoute);
router.use("/reminder", reminderRoute);
router.use("/payment", paymentRoute);
router.use("/ai", ai);

module.exports = router;
