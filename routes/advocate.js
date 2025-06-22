const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  addAdvocate,
  getAllAdvocates,
  getAdvocate,
  editAdvocate,
  getAllAdvocatesCases,
} = require("../controllers/advocateController");
const router = express.Router();

router.post("/add", requireAuth, addAdvocate);

router.get("/allAdvocates", requireAuth, getAllAdvocates);

router.get("/advocate/:id", requireAuth, getAdvocate);

router.patch("/editAdvocate/:id", requireAuth, editAdvocate);

router.get("/getAllCases/:id", requireAuth, getAllAdvocatesCases);

module.exports = router;
