// Cause List
const getCauseList_DC = async (payload) => {
  try {
    const causeList = await fetch(
      "https://0cpbgcz0lb.execute-api.ap-south-1.amazonaws.com/causelist/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!causeList.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await causeList.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCauseList = async (req, res) => {
  try {
    const { caseType } = req.body;
    const caseNumData = req.body.caseNumData;
    let causeListData;
    if (caseType == "DC") {
      causeListData = await getCauseList_DC(caseNumData);
    }
    res.status(200).json({ causeListData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cause List in details

const getDeatilsCauseList_DC = async (payload) => {
  try {
    const causeList = await fetch(
      "https://wmfrw4vvyj.execute-api.ap-south-1.amazonaws.com/view_history_data_cause_list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!causeList.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await causeList.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getDeatilsCauseList = async (req, res) => {
  try {
    const { caseType } = req.body;
    const caseNumData = req.body.caseNumData;
    let causeListData;
    if (caseType == "DC") {
      causeListData = await getDeatilsCauseList_DC(caseNumData);
    }
    res.status(200).json({ causeListData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getCauseList, getDeatilsCauseList };
