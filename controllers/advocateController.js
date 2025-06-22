const bcrypt = require("bcrypt");
const Advocate = require("../models/advocate");
const Mapping = require("../models/mapping");

function generatePassword(length = 12, useSpecialChars = true) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "@#";
  // const special = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let allChars = lower + upper + numbers;
  if (useSpecialChars) {
    allChars += special;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }
  return password;
}

const addAdvocate = async (req, res) => {
  if (req.user.type !== "manager") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { name, phoneNumber, email, advocateBarCode, courtOfPractice } =
      req.body;
    if (
      !name ||
      !phoneNumber ||
      !email ||
      !advocateBarCode ||
      !courtOfPractice
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const password = generatePassword(8);

    const hashedPassword = await bcrypt.hash(password, 10);

    const advocate = new Advocate({
      name,
      phoneNumber,
      email,
      advocateBarCode,
      courtOfPractice,
      FirmOwner: req.user.user._id,
      password: hashedPassword,
    });
    await advocate.save();

    console.log(req.user.user);

    req.user.user.advocates.push(advocate);

    await req.user.user.save();

    res.status(200).json({
      message: "Advocate added successfully",
      email: email,
      password: password,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdvocates = async (req, res) => {
  try {
    const advocates = await Advocate.find({ FirmOwner: req.user.user._id });
    res.status(200).json(advocates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAdvocate = async (req, res) => {
  try {
    const advocate = await Advocate.findById(req.params.id);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }
    res.status(200).json(advocate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editAdvocate = async (req, res) => {
  try {
    const { name, phoneNumber, email, advocateBarCode, courtOfPractice } =
      req.body;
    const advocate = await Advocate.findById(req.params.id);
    if (!advocate) {
      return res.status(404).json({ message: "Advocate not found" });
    }
    advocate.name = name;
    advocate.phoneNumber = phoneNumber;
    advocate.email = email;
    advocate.advocateBarCode = advocateBarCode;
    advocate.courtOfPractice = courtOfPractice;
    await advocate.save();
    res.status(200).json({ message: "Advocate updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdvocatesCases = async (req, res) => {
  try {
    const id = req.params.id;
    const advocates = await Mapping.find({ Advocate: id }).populate("case");
    const cases = advocates.map((a) => a.case);
    res.status(200).json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addAdvocate,
  getAllAdvocates,
  getAdvocate,
  editAdvocate,
  getAllAdvocatesCases,
};
