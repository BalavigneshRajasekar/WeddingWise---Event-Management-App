const express = require("express");
const user = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email });
    if (!validUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, validUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const authToken = jwt.sign(
      {
        name: validUser.name,
        id: validUser._id,
        role: validUser.role,
      },
      process.env.TOKENKEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login Successful", token: authToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", err: error.message });
  }
});

module.exports = loginRouter;
