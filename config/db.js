const mongoose = require("mongoose");
require("dotenv").config();

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 3000; // 3 seconds

const dbConnect = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB connected successfully");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);

    if (retries > 0) {
      console.log(
        `🔁 Retrying to connect... (${
          MAX_RETRIES - retries + 1
        }/${MAX_RETRIES})`
      );
      setTimeout(() => {
        dbConnect(retries - 1);
      }, RETRY_INTERVAL_MS);
    } else {
      console.error("🚫 All retries exhausted. Could not connect to DB.");
    }
  }
};

module.exports = dbConnect;
