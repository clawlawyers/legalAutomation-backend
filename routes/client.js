const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  getAllClients,
  addClient,
  addClientToCase,
} = require("../controllers/clientController");
const route = express.Router();

route.get("/getClients", requireAuth, getAllClients);

route.post("/addClient", requireAuth, addClient);

route.post("/addClientToCase", requireAuth, addClientToCase);

module.exports = route;
