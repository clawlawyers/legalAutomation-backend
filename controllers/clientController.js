const Client = require("../models/client");
const Mapping = require("../models/mapping");
const Reminder = require("../models/reminders");

// const getAllClients = async (req, res) => {
//   try {
//     let clients;

//     if (req.user.type === "manager") {
//       clients = await Client.find({ firmOwner: req.user.user._id });
//     } else {
//       clients = await Client.find({ firmOwner: req.user.user.FirmOwner });
//     }

//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching clients", error });
//   }
// };

const getAllClients = async (req, res) => {
  try {
    let clients;

    // Filter clients based on manager or not
    if (req.user.type === "manager") {
      clients = await Client.find({ firmOwner: req.user.user._id }).lean();
    } else {
      clients = await Client.find({
        firmOwner: req.user.user.FirmOwner,
      }).lean();
    }

    // Get all client IDs from above clients
    const clientIds = clients.map((client) => client._id);

    // Fetch reminders for these clients
    const reminders = await Reminder.find(
      { client: { $in: clientIds } },
      "client"
    ).lean();

    const clientIdsWithAlerts = new Set(
      reminders.map((r) => r.client.toString())
    );

    // Add `hasAlert` flag to each client
    const clientsWithAlertStatus = clients.map((client) => ({
      ...client,
      hasAlert: clientIdsWithAlerts.has(client._id.toString()),
    }));

    res.status(200).json(clientsWithAlertStatus);
  } catch (error) {
    console.error("Error fetching clients with alerts:", error);
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

const addClientToCase = async (req, res) => {
  try {
    const { caseId, clientIds } = req.body;
    console.log(clientIds);
    const mappings = await Mapping.findOneAndUpdate(
      { case: caseId },
      {
        client: clientIds,
      }
    );

    res.status(201).json(mappings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client(s) to case", error });
  }
};

const getAllClientCases = async (req, res) => {
  try {
    const clientCases = await Mapping.find({ client: req.params.clientId })
      .populate("case")
      .exec();
    res.status(200).json(clientCases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client(s) to case", error });
  }
};

const getClientsToCase = async (req, res) => {
  try {
    const userId = req.user.user._id;
    let clientCases;
    if (req.user.type === "manager") {
      clientCases = await Mapping.find({
        case: req.params.caseId,
        FirmOwner: userId,
      })
        .populate("client")
        .exec();
    } else {
      clientCases = await Mapping.find({
        case: req.params.caseId,
        Advocate: userId,
      })
        .populate("client")
        .exec();
    }

    const clients = clientCases.map((a) => a.client);

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client(s) to case", error });
  }
};

const editClient = async (req, res) => {
  try {
    const { _id, clientName, email, phone, modeOfCommunication } = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      _id,
      {
        clientName,
        email,
        phone,
        modeOfCommunication,
      },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client(s) to case", error });
  }
};

const deleteClient = async (req, res) => {
  try {
    const _id = req.params.clientId;
    const deletedClient = await Client.findByIdAndDelete(_id);
    // Step 2: Pull the client ID from all Mapping.client arrays
    await Mapping.updateMany({ client: _id }, { $pull: { client: _id } });
    res.status(200).json(deletedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding client(s) to case", error });
  }
};

module.exports = {
  getAllClients,
  addClient,
  addClientToCase,
  getAllClientCases,
  editClient,
  deleteClient,
  getClientsToCase,
};
