const express = require("express");
const {
  login,
  signup,
  loginAdvocate,
  getVerify,
  getVerifyAdvocate,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");
const router = express.Router();

router.post("/manager/login", login);
router.post("/manager/signup", signup);

router.post("/advocate/login", loginAdvocate);

router.get("/getVerify", requireAuth, getVerify);
router.get("/getVerifyAdvocate", requireAuth, getVerifyAdvocate);

module.exports = router;
