const express = require("express");
const app = express();

const dbConnect = require("./config/db");

const cors = require("cors");

dbConnect();
app.use(cors());
app.use(express.json());

const routes = require("./routes/route");
app.use("/api", routes);

app.listen(8889, () => {
  console.log("server is runing at port 8889");
});
