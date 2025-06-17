const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("db connected");
    })
    .catch((e) => {
      console.log("db connection error ", e);
    });
};

module.exports = dbConnect;
