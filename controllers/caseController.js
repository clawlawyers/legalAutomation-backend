const Case = require("../models/case");
const Counter = require("../models/Counter");
const Mapping = require("../models/mapping");
const axios = require("axios");

const {
  parseCaseDetailsDC,
  parseHighCourtCaseDetails,
  processCaseDataDC,
  processCaseDataHC,
} = require("../utils/util");

// Find case by CNR number
const getCaseByCNR = async (cnr_number, caseType) => {
  console.log(cnr_number);
  try {
    let URL;
    if (caseType === "DC") {
      URL =
        "https://1i4lw1eau3.execute-api.ap-south-1.amazonaws.com/cnr_for_causelist_district_court/";
    } else if (caseType === "HC") {
      URL =
        "https://4ej2c7o90d.execute-api.ap-south-1.amazonaws.com/case_service/";
    }

    const response = await axios.post(
      URL,
      { cnr_number },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60 seconds (1 minute) timeout
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Axios error:", error?.message || error);
    return null;
  }
};

const caseFindByCNR = async (req, res) => {
  try {
    const { cnr_number, caseType } = req.body;
    let caseData;
    caseData = await getCaseByCNR(cnr_number, caseType);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Find Case by Filing Number

const getCaseByFilingNum_DC = async (filingData) => {
  try {
    const getCase = await fetch(
      "https://6mltipcrtg.execute-api.ap-south-1.amazonaws.com/filingnumbercase/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filingData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCaseByFilingNum_HC = async (filingData) => {
  try {
    const getCase = await fetch(
      "https://uzqtlrveg7.execute-api.ap-south-1.amazonaws.com/filing_number_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filingData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByFilingNum = async (req, res) => {
  try {
    const { caseType } = req.body;
    const filingData = req.body.filingData;
    console.log(req.body);
    console.log(req.body.filingData);
    let caseData;
    if (caseType == "DC") {
      caseData = await getCaseByFilingNum_DC(filingData);
    } else if (caseType === "HC") {
      caseData = await getCaseByFilingNum_HC(filingData);
    }
    console.log(caseData);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCaseByFilingNumDetail_DC = async (filingData) => {
  try {
    const getCase = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filingData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCaseByFilingNumDetail_HC = async (filingData) => {
  try {
    const getCase = await fetch(
      "https://ysqhlsa8kf.execute-api.ap-south-1.amazonaws.com/view_history_filing_num_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filingData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByFilingNumDetail = async (req, res) => {
  try {
    const { caseType } = req.body;
    const filingData = req.body.filingData;
    let caseData;
    if (caseType == "DC") {
      caseData = await getCaseByFilingNumDetail_DC(filingData);
    } else if (caseType === "HC") {
      caseData = await getCaseByFilingNumDetail_HC(filingData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Find case by case number

const getCaseByCaseNum_DC = async (caseNumData) => {
  try {
    const getCase = await fetch(
      "https://pfdygq7dmd.execute-api.ap-south-1.amazonaws.com/case_number_case_status/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseNumData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCaseByCaseNum_HC = async (caseNumData) => {
  try {
    const getCase = await fetch(
      "https://rqijc5dml3.execute-api.ap-south-1.amazonaws.com/case_number_case_status_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseNumData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByCaseNum = async (req, res) => {
  try {
    const { caseType } = req.body;
    const caseNumData = req.body.caseNumData;
    let caseData;
    if (caseType == "DC") {
      caseData = await getCaseByCaseNum_DC(caseNumData);
    } else if (caseType === "HC") {
      caseData = await getCaseByCaseNum_HC(caseNumData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCaseByCaseNumDetail_DC = async (caseNumData) => {
  try {
    const getCase = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseNumData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCaseByCaseNumDetail_HC = async (caseNumData) => {
  try {
    const getCase = await fetch(
      "https://rq5mg2bbja.execute-api.ap-south-1.amazonaws.com/view_history_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseNumData),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const caseFindByCaseNumDetail = async (req, res) => {
  try {
    const { caseType } = req.body;
    const caseNumData = req.body.caseNumData;
    let caseData;
    if (caseType == "DC") {
      caseData = await getCaseByCaseNumDetail_DC(caseNumData);
    } else if (caseType === "HC") {
      caseData = await getCaseByCaseNumDetail_HC(caseNumData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Case find by party name

const getCaseByPartyName_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://3m8ranqefg.execute-api.ap-south-1.amazonaws.com/party_name_case_status/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCaseByPartyName_HC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://b91j6osntc.execute-api.ap-south-1.amazonaws.com/party_name_case_status_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByPartyName = async (req, res) => {
  try {
    const { caseType } = req.body;
    const partyNameData = req.body.partyNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await getCaseByPartyName_DC(partyNameData);
    } else if (caseType === "HC") {
      caseData = await getCaseByPartyName_HC(partyNameData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByPartyNameDetail_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByPartyNameDetail_HC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://rq5mg2bbja.execute-api.ap-south-1.amazonaws.com/view_history_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByPartyNameDetail = async (req, res) => {
  try {
    const { caseType } = req.body;
    const partyNameData = req.body.partyNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await caseFindByPartyNameDetail_DC(partyNameData);
    } else if (caseType === "HC") {
      caseData = await caseFindByPartyNameDetail_HC(partyNameData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateName_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://my7n4orjql.execute-api.ap-south-1.amazonaws.com/adv_name_case_status/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByAdvocateName_HC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://ccf70kswxa.execute-api.ap-south-1.amazonaws.com/adv_name_casestatus_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateName = async (req, res) => {
  try {
    const { caseType } = req.body;
    const advocateNameData = req.body.advocateNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await caseFindByAdvocateName_DC(advocateNameData);
    } else if (caseType === "HC") {
      caseData = await caseFindByAdvocateName_HC(advocateNameData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateNameDetail_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByAdvocateNameDetail_HC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://rq5mg2bbja.execute-api.ap-south-1.amazonaws.com/view_history_hc/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateNameDetail = async (req, res) => {
  try {
    const { caseType } = req.body;
    const advocateNameData = req.body.advocateNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await caseFindByAdvocateNameDetail_DC(advocateNameData);
    } else if (caseType === "HC") {
      caseData = await caseFindByAdvocateNameDetail_HC(advocateNameData);
    }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateNameBarCode_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://lnl09c73lc.execute-api.ap-south-1.amazonaws.com/adv_barcode_case_status/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    // console.log(getCase);
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// const caseFindByAdvocateNameBarCode_HC = async (payload) => {
//   try {
//     const getCase = await fetch(
//       "https://rq5mg2bbja.execute-api.ap-south-1.amazonaws.com/view_history_hc_barcode/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );
//     if (!getCase.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await getCase.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const caseFindByAdvocateNameBarCode = async (req, res) => {
  try {
    const { caseType } = req?.body;
    const advocateNameData = req?.body?.advocateNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await caseFindByAdvocateNameBarCode_DC(advocateNameData);
    }

    //  else if (caseType === "HC") {
    //   caseData = await caseFindByAdvocateNameBarCode_HC(advocateNameData);
    // }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const caseFindByAdvocateNameBarCodeDetail_DC = async (payload) => {
  try {
    const getCase = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const caseFindByAdvocateNameBarCodeDetail = async (req, res) => {
  try {
    const { caseType } = req.body;
    const advocateNameData = req.body.advocateNameData;
    let caseData;
    if (caseType == "DC") {
      caseData = await caseFindByAdvocateNameBarCodeDetail_DC(advocateNameData);
    }
    //  else if (caseType === "HC") {
    //   caseData = await caseFindByAdvocateNameBarCodeDetail_HC(advocateNameData);
    // }
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const addCaseToDB = async (req, res) => {
//   try {
//     const { caseData, caseType } = req.body;
//     // Add your database logic here
//     let getCase;
//     if (caseType === "DC") {
//       getCase = await parseCaseDetailsDC(caseData);
//     } else if (caseType === "HC") {
//       getCase = await parseHighCourtCaseDetails(caseData);
//     }
//     if (!getCase) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     // Check if it is already in the db

//     let getDBCase = await Case.findOne({ crnNum: getCase.crnNum });
//     if (getDBCase) {
//       // update the case

//       getDBCase = await Case.findByIdAndUpdate(getDBCase._id, getCase, {
//         new: true,
//       });
//     } else {
//       // Insert to DB

//       getDBCase = await Case.create(getCase);
//       await getDBCase.save();
//     }

//     // Create Mapping

//     const isExistMapping = await Mapping.findOne({
//       case: getDBCase._id,
//       Advocate: req.user.user._id,
//     });
//     if (isExistMapping) {
//       return res
//         .status(200)
//         .json({ message: "Case added successfully", case: caseData });
//     }

//     const mapping = await Mapping.create({
//       case: getDBCase._id,
//       Advocate: req.user.user._id,
//     });

//     await mapping.save();

//     res
//       .status(201)
//       .json({ message: "Case added successfully", case: caseData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const addCaseToDB = async (req, res) => {
  try {
    const { caseData, caseType } = req.body;

    let getCase;
    if (caseType === "DC") {
      getCase = caseData;
      // getCase = await processCaseDataDC(caseData);
    } else if (caseType === "HC") {
      getCase = caseData;
      // getCase = await processCaseDataHC(caseData.case);
    }

    if (!getCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    let getDBCase = await Case.findOne({ crnNum: getCase.crnNum });

    if (getDBCase) {
      getDBCase = await Case.findByIdAndUpdate(getDBCase._id, getCase, {
        new: true,
      });
    } else {
      // 🔥 Generate clawCaseId
      const counter = await Counter.findOneAndUpdate(
        { name: "claw_case_id" },
        { $inc: { value: 1 } },
        { new: true, upsert: true } // Create if not exists
      );

      const paddedNumber = String(counter.value).padStart(5, "0"); // "00001", "00002", ...
      getCase.clawCaseId = `CL${paddedNumber}`;

      getDBCase = await Case.create(getCase);
      await getDBCase.save();
    }

    // Create Mapping
    const isExistMapping = await Mapping.findOne({
      case: getDBCase._id,
      Advocate: req.user.user._id,
    });

    if (isExistMapping) {
      return res
        .status(200)
        .json({ message: "Case added successfully", case: getDBCase });
    }

    let mapping;

    if (req.user.type === "manager") {
      mapping = await Mapping.create({
        case: getDBCase._id,
        FirmOwner: req.user.user._id,
      });
    } else {
      mapping = await Mapping.create({
        case: getDBCase._id,
        Advocate: req.user.user._id,
        FirmOwner: req.user.user.FirmOwner,
      });
    }

    await mapping.save();

    res
      .status(201)
      .json({ message: "Case added successfully", case: getDBCase });

    // res.status(201).json({ message: "Case added successfully", case: getCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCasesByUser = async (req, res) => {
  try {
    const userId = req.user.user._id;
    let cases;
    if (req.user.type === "manager") {
      cases = await Mapping.find({ FirmOwner: userId })
        .populate("case")
        .populate("client")
        .exec();
    } else {
      cases = await Mapping.find({ Advocate: userId })
        .populate("case")
        .populate("client")
        .exec();
    }

    console.log(cases);
    if (!cases || cases.length === 0) {
      return res
        .status(200)
        .json({ message: "No cases found for this user", cases: [] });
    }

    res.status(200).json({ cases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchCaseType = async (body) => {
  try {
    const respo = await fetch(
      "https://6yx7p9e8eb.execute-api.ap-south-1.amazonaws.com/case_type_list_ecourts/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log(respo);

    if (!respo.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await respo.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getCaseType = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const data = await fetchCaseType(body);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchBanchCode = async (body) => {
  try {
    const respo = await fetch(
      "https://nph91ovhql.execute-api.ap-south-1.amazonaws.com/bench_code/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!respo.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await respo.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getBenchCode = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const data = await fetchBanchCode(body);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCasesByPrompt = async (payload) => {
  try {
    getCases = await fetch("http://20.193.139.213:8000/get_cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!getCases.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCases.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const caseFindByPrompt = async (req, res) => {
  try {
    const payload = req.body;
    const data = await getCasesByPrompt(payload);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetCaseFindByPromptSummary = async (payload) => {
  try {
    getCases = await fetch(" http://20.193.139.213:8000/summarize_by_case", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!getCases.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCases.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const caseFindByPromptSummary = async (req, res) => {
  try {
    const payload = req.body;
    const data = await GetCaseFindByPromptSummary(payload);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getAllFirmCases = async (req, res) => {
//   try {
//     const mappings = await Mapping.find()
//       .populate({
//         path: "Advocate",
//         match: { FirmOwner: req.user.user._id },
//       })
//       .populate("case")
//       .populate("client");

//     const cases = mappings.map((a) => a.case);

//     res.status(200).json(cases);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const fetchEcourtCases = async (body) => {
  try {
    const respo = await fetch(
      "https://8evpnei35h.execute-api.ap-south-1.amazonaws.com/court_num_ecourt_use_in_causelist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!respo.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await respo.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getEcourtCauseList = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const data = await fetchEcourtCases(body);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchScrapOrders = async (caseType, payload) => {
  try {
    let URL;
    if (caseType === "DC") {
      URL = "http://20.33.87.15:8000/extract";
    } else if (caseType === "HC") {
      URL = "http://20.33.87.15:5000/extract";
    }
    getCases = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!getCases.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCases.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const scrapOrders = async (req, res) => {
  try {
    const caseData = req.body.caseData;
    const caseType = req.body.caseType;
    console.log(caseType);
    const data = await fetchScrapOrders(caseType, caseData);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchOrderPdf = async (caseType, payload) => {
  try {
    let URL;
    if (caseType === "DC") {
      URL = "http://20.33.87.15:8000/signed_url";
    } else if (caseType === "HC") {
      URL = "http://20.33.87.15:5000/signed_url";
    }
    getCases = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(getCases);
    if (!getCases.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCases.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getOrderPdf = async (req, res) => {
  try {
    const payload = req.body.caseData;
    const caseType = req.body.caseType;
    const data = await fetchOrderPdf(caseType, payload);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
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
  // getAllFirmCases,
  getEcourtCauseList,
  scrapOrders,
  getOrderPdf,
};
