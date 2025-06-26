const FirmOwner = require("../models/firmOwner");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Advocate = require("../models/advocate");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const firmOwner = await FirmOwner.findOne({ email }).populate({
      path: "advocates",
      select: "-password", // exclude advocate passwords
    });

    if (!firmOwner) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(password, firmOwner.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: firmOwner._id, type: "manager" },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    // Convert document to object and remove password
    const { password: _, ...ownerWithoutPassword } = firmOwner.toObject();

    res
      .status(200)
      .json({ token, firmOwner: ownerWithoutPassword, type: "manager" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      advocateBarCode,
      courtOfPractice,
      state,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !advocateBarCode ||
      !courtOfPractice ||
      !state
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const firmOwner = await FirmOwner.findOne({ email });

    if (firmOwner) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFirmOwner = new FirmOwner({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      advocateBarCode,
      courtOfPractice,
      state,
    });

    await newFirmOwner.save();

    const token = jwt.sign(
      { id: newFirmOwner._id, type: "manager" },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    // Convert document to object and remove password
    const { password: _, ...ownerWithoutPassword } = newFirmOwner.toObject();

    res
      .status(200)
      .json({ token, firmOwner: ownerWithoutPassword, type: "manager" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginAdvocate = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const advocate = await Advocate.findOne({ email });
    if (!advocate) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!(await bcrypt.compare(password, advocate.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: advocate._id, type: "advocate" },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    const { password: _, ...advocateWithoutPassword } = advocate.toObject();

    res.status(200).json({ token, advocateWithoutPassword, type: "advocate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVerify = async (req, res) => {
  try {
    const firmOwner = req.user.user;
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Firm Owner:", firmOwner);
    // Convert document to object and remove password
    const { password: _, ...ownerWithoutPassword } = firmOwner.toObject();

    res
      .status(200)
      .json({ token, firmOwner: ownerWithoutPassword, type: "manager" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getVerifyAdvocate = async (req, res) => {
  try {
    const advocate = req.user.user;
    const token = req.headers.authorization?.split(" ")[1];

    const { password: _, ...advocateWithoutPassword } = advocate.toObject();

    res.status(200).json({ token, advocateWithoutPassword, type: "advocate" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { login, signup, loginAdvocate, getVerify, getVerifyAdvocate };
