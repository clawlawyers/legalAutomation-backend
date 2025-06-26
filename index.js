const express = require("express");
const app = express();
const dbConnect = require("./config/db");
const cron = require("node-cron"); // Add this line
const cors = require("cors");

dbConnect();
app.use(cors());
app.use(express.json());

const routes = require("./routes/route");
const { checkReminders } = require("./utils/DbAutomationService");
app.use("/api", routes);

app.post("/api/checkDate", async (req, res) => {
  try {
    function parseNative(dateStr) {
      const cleaned = dateStr?.replace(/(\d+)(st|nd|rd|th)/, "$1");
      const date = new Date(cleaned);
      return isNaN(date.getTime()) ? null : date;
    }

    const date = parseNative(req.body.date);
    if (!date) {
      return res.status(200).json({ message: "Invalid date format" });
    }

    console.log("Parsed date:", date);
    res.status(200).json({
      message: "Date checked successfully",
      date: date.toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to check date" });
  }
});

cron.schedule(
  "0 8 * * *", // Run daily at 8:00 AM
  async () => {
    console.log("✅ Running daily reminder check at 8 AM");
    await checkReminders();
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Indian Standard Time
  }
);

app.listen(8889, () => {
  console.log("server is runing at port 8889");
});
