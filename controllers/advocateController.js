const bcrypt = require("bcrypt");
const Advocate = require("../models/advocate");

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

module.exports = { addAdvocate };
