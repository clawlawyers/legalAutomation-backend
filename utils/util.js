const formatPreviousOrders = (hearings) =>
  hearings
    .map((item) => {
      if (item.business_on_date) {
        const [day, month, year] = item.business_on_date.split("-");
        return new Date(`${year}-${month}-${day}`);
      }
      return null;
    })
    .filter((d) => d); // remove nulls

const getStateByDistrict = async (district) => {
  try {
    const getResponse = await fetch(
      "https://eqqtcxkidc.execute-api.ap-south-1.amazonaws.com/find_codes_from_json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryStringParameters: {
            query: district,
          },
        }),
      }
    );
    if (!getResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getResponse.json();
    console.log(data.body.state_name);
    return {
      state: data.body.state_name,
      district: data.body.district_name,
      courtComplex: data.body.court_complex_name,
    };
  } catch (error) {
    console.error("Error fetching state by district:", error);
    throw new Error("Failed to fetch state by district");
  }
};
const parseCaseDetailsDC = async (apiResponse) => {
  const caseData = apiResponse?.case?.body;
  if (!caseData) throw new Error("Invalid API response structure");

  const {
    case_details,
    case_status,
    petitioners,
    respondents,
    hearing_history,
  } = caseData;

  // Extract year from filing date
  const getYear = (dateStr) => {
    const parts = dateStr.split("-");
    return parts[2];
  };

  const state = await getStateByDistrict(
    caseData.court_name?.split(",")[1]?.trim() || ""
  );

  // Parse court name to get state, district, courtComplex (assumes format: 'CourtType , District')
  const [courtComplex, districtRaw] = caseData.court_name?.split(",") || [];
  const district = districtRaw?.trim() || "";

  return {
    crnNum: case_details.cnr_number.replace(/-/g, ""),
    filingNum: case_details.filing_number.split("/")[0],
    registrationNum: case_details.registration_number.split("/")[0],
    caseType: case_details.case_type,
    partyName: {
      petitioners,
      respondents,
    },
    caseNum: case_details.registration_number.split("/")[0],
    year: getYear(case_details.filing_date),
    previousCourtOrder: formatPreviousOrders(hearing_history) || [], // hearing_history is empty
    state,
    district,
    courtComplex: courtComplex?.trim() || "",
    caseStatus: case_status.case_status,
    caseHierarchy: "District Court",
    NextHearingDate: new Date(
      case_status.first_hearing_date.replace(/(\d+)(st|nd|rd|th)/, "$1")
    ),
    lastFetchedDate: new Date(),
  };
};

const parseHighCourtCaseDetails = (apiResponse) => {
  const caseData = apiResponse?.case?.body;
  if (!caseData) throw new Error("Invalid API response structure");

  const {
    case_details,
    case_status,
    petitioner_advocate,
    respondent_advocate,
    hearing_history,
  } = caseData.data;

  console.log(case_details);

  // Helper: clean caseNum (remove prefixes like 'APPL /')

  // Helper: convert business_on_date to Date array

  return {
    crnNum: case_details["CNR Number"].replace(/-/g, ""),
    filingNum: case_details["Filing Number"].split("/")[1],
    registrationNum: case_details["Registration Number"].split("/")[1],
    caseType: case_details["Filing Number"].split("/")[0] || "Unknown",
    partyName: {
      petitioners: petitioner_advocate,
      respondents: respondent_advocate,
    },
    caseNum: case_details["Registration Number"].split("/")[1],
    year: case_details["Filing Number"].split("/")[2],
    previousCourtOrder: formatPreviousOrders(hearing_history),
    state: case_status.State,
    district: case_status.District,
    courtComplex: case_status["Judicial Branch"] || "Not Mentioned",
    caseHierarchy: "High Court",
    caseStatus: case_status["Case Status"],
    // NextHearingDate: new Date(case_status.first_hearing_date),
    NextHearingDate: new Date(
      case_status["First Hearing Date"].replace(/(\d+)(st|nd|rd|th)/, "$1")
    ),
    lastFetchedDate: new Date(),
  };
};

async function processCaseDataDC(data) {
  const caseData = data.case.body.case_data;
  const miscellaneousData = data.case.body.miscellaneous_data;

  // Normalize CNR number
  let cnrNumber = data.case.body.cnr_number;
  if (
    caseData.case_details.cnr_number &&
    caseData.case_details.cnr_number.includes(
      "(Note the CNR number for future reference)"
    )
  ) {
    cnrNumber = caseData.case_details.cnr_number
      .replace("(Note the CNR number for future reference)", "")
      .trim();
  }

  // Determine case status and next hearing details
  let statusDetails = {};
  if (caseData?.case_status?.case_status === "Case disposed") {
    statusDetails = {
      overallStatus: "Disposed",
      decisionDate: caseData?.case_status?.decision_date,
      natureOfDisposal: caseData?.case_status?.nature_of_disposal,
      nextHearingDate: "", // Explicitly set to null for disposed cases
      stageOfCase: "",
    };
  } else {
    statusDetails = {
      overallStatus: "Ongoing",
      decisionDate: "", // Explicitly set to null for ongoing cases
      natureOfDisposal: "",
      nextHearingDate: caseData?.case_status?.next_hearing_date,
      stageOfCase: caseData?.case_status?.case_stage,
    };
  }

  // Process history details
  const history = Object.keys(miscellaneousData?.history_details)
    .map((date) => ({
      date: date,
      ...miscellaneousData?.history_details[date],
    }))
    .filter((entry) => Object.keys(entry).length > 1); // Filter out empty initial entries if desired

  const stateData = await getStateByDistrict(caseData.court);

  return {
    crnNum: cnrNumber,
    filingNum: caseData?.case_details?.filing_number.split("/")[0],
    registrationNum: caseData?.case_details?.registration_number?.split("/")[0],
    caseType: caseData?.case_details?.case_type,
    caseNum: caseData?.case_details?.registration_number?.split("/")[0],
    year: caseData?.case_details?.registration_number?.split("/")[1],
    category: "",
    ...stateData,
    caseHierarchy: "District Court",
    coram: "",
    judicialBranch: "",
    benchType: "",
    // petitioner: caseData.petitioner,
    // respondent: caseData.respondent,
    firstHearingDate: caseData?.case_status?.first_hearing_date,
    partyName: {
      petitioners: caseData?.petitioner,
      respondents: caseData?.respondent,
    },
    actsAndSections: caseData?.acts,
    ...statusDetails, // Spread the normalized status details
    hearingHistory: history,
  };
}

function processCaseDataHC(rawCaseData) {
  // Basic validation for the raw input structure and status code
  if (
    !rawCaseData ||
    rawCaseData.statusCode !== 200 ||
    !rawCaseData.body ||
    !rawCaseData.body.data
  ) {
    console.error(
      "Invalid rawCaseData structure or unsuccessful status code.",
      rawCaseData
    );
    return null;
  }

  const data = rawCaseData.body.data;
  const caseDetails = data.case_details || {};
  const caseStatus = data.case_status || {};
  const petitionerAdvocateRaw = data.petitioner_advocate || [];
  const respondentAdvocateRaw = data.respondent_advocate || [];
  const acts = data.acts || [];
  const categoryDetails = data.category_details || {};
  const hearingHistory = data.hearing_history || [];
  const orders = data.orders || [];
  const documentDetails = data.document_details || [];

  // --- Normalize Case Details ---
  const cnrNumber = caseDetails["CNR Number"]
    ? caseDetails["CNR Number"]
        .replace("(Note the CNR number for future reference)", "")
        .trim()
    : "N/A";

  // --- Normalize Case Status ---
  let firstHearingDate = caseStatus["First Hearing Date"] || "N/A";
  if (firstHearingDate === "") {
    // Handle empty string specifically
    firstHearingDate = "Not Available";
  }

  let nextHearingDate = caseStatus["Next Hearing Date"] || "N/A";
  if (nextHearingDate === ": -" || nextHearingDate.trim() === "-") {
    // Handle specific placeholder strings
    nextHearingDate = "Not Available";
  } else {
    // nextHearingDate = nextHearingDate.replace(/[:\s-]+/g, "").trim(); // Clean up if it's " : -" or similar
    nextHearingDate = nextHearingDate;
  }

  const stageOfCase = caseStatus["Stage of Case"] || "N/A";
  const coram = caseStatus["Coram"] || "N/A";
  const benchType = caseStatus["Bench Type"] || "N/A";
  const judicialBranch = caseStatus["Judicial Branch"] || "N/A";
  const state = caseStatus["State"] || "N/A";
  const district = caseStatus["District"] || "N/A";

  // Determine overall case status (disposed vs. ongoing) from previous example logic
  let currentCaseStatus = "Ongoing"; // Default to ongoing if no explicit disposal status
  let decisionDate = "N/A";
  let natureOfDisposal = "N/A";

  // This part assumes we might get a 'case_status' key like in the previous example
  // If your API always provides 'Stage of Case' for ongoing, and 'case_status' for disposed,
  // you'll need to adapt this or merge the two data structures intelligently.
  // For this specific JSON, we'll primarily use 'Stage of Case' for active status.
  // If you receive the 'Case disposed' structure, you'd add similar logic here.
  // For now, let's assume 'Stage of Case' being present implies ongoing.

  // --- Process Acts ---
  const parsedActs = acts
    .map((act) => {
      return {
        act: act.act || "N/A",
        section: act.section ? act.section : "N/A", // Remove trailing comma if present
      };
    })
    .filter((act) => act.act !== "N/A"); // Filter out acts with no name

  // --- Process Hearing History ---
  const parsedHearingHistory = hearingHistory.map((hearing) => ({
    causeListType: hearing["Cause List Type"] || "N/A",
    judge: hearing["Judge"] || "N/A",
    businessOnDate: hearing["Business On Date"]
      ? hearing["Business On Date"].text || "N/A"
      : "N/A",
    hearingDate: hearing["Hearing Date"] || "N/A",
    purposeOfHearing: hearing["Purpose of hearing"] || "N/A",
  }));

  // --- Process Orders ---
  const parsedOrders = orders.map((order) => ({
    orderNumber: order["Order Number"] || "N/A",
    orderOn: order["Order on"] || "N/A",
    judge: order["Judge"] || "N/A",
    orderDate: order["Order Date"] || "N/A",
    orderDetails: order["Order Details"] || "N/A", // This seems to be "View", so might need specific handling
  }));

  // --- Process Document Details ---
  const parsedDocuments = documentDetails.map((doc) => ({
    srNo: doc["Sr. No."] || "N/A",
    documentNo: doc["Document No."] || "N/A",
    dateOfReceiving: doc["Date of Receiving"] || "N/A",
    filedBy: doc["Filed by"] || "N/A",
    nameOfAdvocate: doc["Name of Advocate"] || "N/A",
    documentFiled: doc["Document Filed"] || "N/A",
  }));

  return {
    crnNum: cnrNumber.replace(/-/g, ""),
    filingNum: caseDetails["Filing Number"].split("/")[1] || "N/A",
    registrationNum: caseDetails["Registration Number"].split("/")[1] || "N/A",
    caseType: caseDetails["Filing Number"].split("/")[0] || "Unknown",
    caseNum: caseDetails["Registration Number"].split("/")[1] || "N/A",
    year: caseDetails["Filing Number"].split("/")[2] || "N/A",
    category: categoryDetails.Category || "N/A",
    state: state,
    district: district,
    courtComplex: "",
    caseHierarchy: "High Court", // Assuming this is always High Court based on the provided JSON
    stageOfCase: stageOfCase,
    overallStatus: currentCaseStatus, // This is a simplified determination based on the provided JSON
    coram: coram,
    judicialBranch: judicialBranch,
    benchType: benchType,
    decisionDate: decisionDate,
    natureOfDisposal: natureOfDisposal,
    firstHearingDate: firstHearingDate,
    nextHearingDate: nextHearingDate,
    partyName: {
      petitioners: petitionerAdvocateRaw,
      respondents: respondentAdvocateRaw,
    },
    actsAndSections: parsedActs,
    hearingHistory: parsedHearingHistory,
    // orders: parsedOrders,
    // documentDetails: parsedDocuments,
    // miscellaneous: data.miscellaneous, // You can include raw miscellaneous if needed, or process it further
  };
}

module.exports = {
  parseCaseDetailsDC,
  parseHighCourtCaseDetails,
  processCaseDataDC,
  processCaseDataHC,
};
