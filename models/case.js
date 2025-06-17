const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  clawCaseId: {
    type: String,
    // required: true,
    default: "",
  },
  crnNum: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  filingNum: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  registrationNum: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  caseType: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  caseNum: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  year: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },

  category: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },

  state: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  district: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  courtComplex: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  caseHierarchy: {
    // DC HC
    // It can be District, High Court, Supreme Court, etc.
    type: String,
    // required: true,
    default: "",
  },
  stageOfCase: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  overallStatus: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  coram: {
    //DC HC
    type: String,
    // required: true,
    default: "",
  },
  judicialBranch: {
    //DC HC
    type: String,
    // required: true,
    default: "",
  },
  benchType: {
    //DC HC
    type: String,
    // required: true,
    default: "",
  },
  decisionDate: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  natureOfDisposal: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  firstHearingDate: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  nextHearingDate: {
    // DC HC
    type: String,
    // required: true,
    default: "",
  },
  partyName: {
    // DC HC
    // petitioners and respondents
    petitioners: [
      {
        type: String,
        // required: true,
        default: "",
      },
    ],
    respondents: [
      {
        type: String,
        // required: true,
        default: "",
      },
    ],
  },
  actsAndSections: [
    // DC HC
    {
      act: {
        type: String,
        // required: true,
        default: "",
      },
      section: {
        type: String,
        // required: true,
        default: "",
      },
    },
  ],
  hearingHistory: [
    // DC HC
    {
      date: {
        type: String,
        // required: true,
        default: "",
      },
      next_purpose: {
        type: String,
        // required: true,
        default: "",
      },
      next_hearing_date: {
        type: String,
        // required: true,
        default: "",
      },
      business: {
        type: String,
        // required: true,
        default: "",
      },

      disposalDate: {
        type: String,
        // required: true,
        default: "",
      },

      // For HC
      causeListType: {
        type: String,
        // required: true,
        default: "",
      },
      judge: {
        type: String,
        // required: true,
        default: "",
      },
      businessOnDate: {
        // This is inconsistent with the rest of the schema, so it's commented out
        type: String,
        // required: true,
        default: "",
      },
      purposeOfHearing: {
        type: String,
        // required: true,
        default: "",
      },
      hearingDate: {
        type: String,
        // required: true,
        default: "",
      },
    },
  ],
  lastFetchedDate: {
    type: Date, // or Date if it's an actual date
    // required: true,
    default: Date.now,
  },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
