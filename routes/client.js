const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  getAllClients,
  addClient,
  addClientToCase,
  getAllClientCases,
  editClient,
  deleteClient,
  getClientsToCase,
} = require("../controllers/clientController");
const route = express.Router();

route.get("/getClients", requireAuth, getAllClients);

route.post("/addClient", requireAuth, addClient);

route.patch("/editClient", requireAuth, editClient);

route.delete("/deleteClient/:clientId", requireAuth, deleteClient);

route.post("/addClientToCase", requireAuth, addClientToCase);

route.get("/getAllClientCases/:clientId", requireAuth, getAllClientCases);

route.get("/getClientsToCase/:caseId", requireAuth, getClientsToCase);

module.exports = route;
