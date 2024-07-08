const express = require("express");
const user = require("../models/users");
const bcrypt = require("bcrypt");

const registerRouter = express.Router();

registerRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const mailCheck = await user.findOne({ email: email });
    if (mailCheck) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name: name,
      email: email,
      password: hashPassword,
      role: role == true ? "Admin" : "User",
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = registerRouter;
