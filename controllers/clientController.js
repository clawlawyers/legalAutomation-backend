const Client = require("../models/client");
const Mapping = require("../models/mapping");

const getAllClients = async (req, res) => {
  try {
    let clients;

    if (req.user.type === "manager") {
      clients = await Client.find({ firmOwner: req.user.user._id });
    } else {
      clients = await Client.find({ firmOwner: req.user.user.FirmOwner });
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

const addClient = async (req, res) => {
  const { clientName, email, phone, modeOfCommunication } = req.body;

  if (!clientName || !email) {
    return res
      .status(400)
      .json({ message: "Client name and email are required" });
  }

  console.log(req.user);
  try {
    let newClient;
    // Check if the user is a manager or advocate
    if (req.user.type === "manager") {
      newClient = new Client({
        clientName,
        email,
        phone,
        modeOfCommunication,
        firmOwner: req.user.user._id, // Associate with the logged-in firm owner
      });
    } else {
      newClient = new Client({
        clientName,
        email,
        phone,
        modeOfCommunication,
        firmOwner: req.user.user.FirmOwner, // Associate with the logged-in firm owner
      });
    }

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Error adding client", error });
  }
};

const addClientToCase = async () => {
  try {
    const { caseId, clientId } = req.body;

    const mapping = await Mapping.create({
      case: caseId,
      client: clientId,
      Advocate: req.user.user._id,
    });

    res.status(201).json(mapping);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding client to case", error });
  }
};

module.exports = {
  getAllClients,
  addClient,
  addClientToCase,
};
