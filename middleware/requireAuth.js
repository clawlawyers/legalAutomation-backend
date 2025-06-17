const Advocate = require("../models/advocate");
const FirmOwner = require("../models/firmOwner");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    console.log("Token:", token);

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type === "manager") {
      const firmOwner = await FirmOwner.findById(decoded.id);
      if (!firmOwner) {
        return res.status(401).json({ message: "Token is invalid" });
      }
      req.user = { user: firmOwner, type: "manager" };
      return next(); // ✅ return here
    } else if (decoded.type === "advocate") {
      const advocate = await Advocate.findById(decoded.id);
      if (!advocate) {
        return res.status(401).json({ message: "Token is invalid" });
      }
      req.user = { user: advocate, type: "advocate" };
      return next(); // ✅ return here
    }

    // If token type is neither manager nor salesman
    return res.status(401).json({ message: "Token type is invalid" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = { requireAuth };
