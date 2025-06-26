const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  caseFindByCNR,
  caseFindByFilingNum,
  caseFindByFilingNumDetail,
  caseFindByCaseNum,
  caseFindByCaseNumDetail,
  caseFindByPartyName,
  caseFindByPartyNameDetail,
  caseFindByAdvocateName,
  caseFindByAdvocateNameDetail,
  caseFindByAdvocateNameBarCode,
  caseFindByAdvocateNameBarCodeDetail,
  addCaseToDB,
  getCasesByUser,
  getCaseType,
  getBenchCode,
  caseFindByPrompt,
  caseFindByPromptSummary,
  getAllFirmCases,
  getEcourtCauseList,
} = require("../controllers/caseController");
const router = express.Router();

// Find Case by CRN number
router.post("/caseFind/crn", caseFindByCNR);

// Find case by Filing Number
router.post("/caseFind/filingNum", caseFindByFilingNum);
router.post("/caseFind/filingNum/detail", caseFindByFilingNumDetail);

// Find case by case number
router.post("/caseFind/caseNum", caseFindByCaseNum);
router.post("/caseFind/caseNum/detail", caseFindByCaseNumDetail);

// Case based on Party name , Advocate Name, Advocate Bar Code

// Case based on Party name

router.post("/caseFind/partyName", caseFindByPartyName);
router.post("/caseFind/partyName/detail", caseFindByPartyNameDetail);

// Case based on Advocate Name

router.post("/caseFind/advocateName", caseFindByAdvocateName);
router.post("/caseFind/advocateName/detail", caseFindByAdvocateNameDetail);

// Case based on Advocate Bar Code

router.post("/caseFind/advocateBarCode", caseFindByAdvocateNameBarCode);
router.post(
  "/caseFind/advocateBarCode/detail",
  caseFindByAdvocateNameBarCodeDetail
);

// Add case to DB
router.post("/addCase/db", requireAuth, addCaseToDB);

// Get Cases By User
router.get("/getCases/user", requireAuth, getCasesByUser);

// get case Type
router.post("/getCaseType", requireAuth, getCaseType);

// get bench code

router.post("/getBanchCode", requireAuth, getBenchCode);

//case search

router.post("/caseSearch", requireAuth, caseFindByPrompt);

router.post("/caseSearch/summary", caseFindByPromptSummary);

// getAll Case From Firm

// router.get("/getAllFirmCases", requireAuth, getAllFirmCases);

// get ecourt cause list

router.post("/ecourt-causeList", requireAuth, getEcourtCauseList);

module.exports = router;
