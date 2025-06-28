const fetchEhanceWithAI = async (payload) => {
  try {
    const getCase = await fetch(" http://74.225.162.118:8000/text-enhance/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(getCase);
    if (!getCase.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await getCase.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const ehanceWithAI = async (req, res) => {
  try {
    const message = req.body.message;
    console.log(req.user.user);
    const state = req.user.user.state;
    ehancedMessage = await fetchEhanceWithAI({ text: message, state });
    res.status(200).json(ehancedMessage);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { ehanceWithAI };
