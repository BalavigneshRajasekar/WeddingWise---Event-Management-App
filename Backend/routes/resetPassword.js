const express = require("express");
const nodeMailer = require("nodemailer");
const mailDesign = require("mailgen");
const signup = require("../models/users");
const bcrypt = require("bcrypt");
const Auth = require("../middlewares/resetLinkAuth");
require("dotenv").config();

const resetPassword = express.Router();

//This endpoint will Verify the Verification code and send Reset password form as response
resetPassword.post("/password", Auth, async (req, res) => {
  const { code } = req.body;

  try {
    const checkCode = await signup.findOne({ resetCode: code });
    if (!checkCode) {
      return res.status(400).json({ message: "Invalid Code" });
    }

    const mailGenerator = new mailDesign({
      theme: "default",
      product: {
        name: "Event Management",
        link: "http://localhost:3000",
      },
    });

    const mail = mailGenerator.generate({
      body: {
        name: checkCode.name,
        intro: `Hi ${checkCode.name}`,
        action: {
          instructions: "To reset your password, click the below button:",
          button: {
            color: "#22BC66",
            text: "Reset Password",
            link: `http://localhost:3000/api/reset/resetPassword/${req.user.id}`,
          },
        },
      },
    });

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "vigneshvickybsc1999@gmail.com",
        pass: process.env.PASS,
      },
    });

    const messages = {
      from: "vigneshvickybsc1999@gmail.com",
      to: checkCode.email,
      subject: "Reset Password",
      text: "Hi find Reset Password here",
      html: mail,
    };

    transporter
      .sendMail(messages)
      .then(() => {
        res
          .status(200)
          .json({ message: "Reset Password link send successfully" });
      })
      .catch((err) => {
        res.status(500).json({ message: "error while sending link" });
      });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

// render Reset password page SSR

resetPassword.get("/resetPassword/:id", async (req, res) => {
  const { id } = req.params;
  const verifyUser = await signup.findOne({ _id: id });
  if (!verifyUser) {
    return res.status(400).json({ message: "Invalid Link" });
  }
  if (verifyUser.resetCode == null) {
    return res.status(400).json({ message: "Link expired" });
  }
  res.render("resetPassword", {
    email: verifyUser.email,
  });
});

//reset the password and render the succesfull message
resetPassword.post("/resetPassword/:id", async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  const { id } = req.params;
  try {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const user = await signup.findOne({ _id: id });
    user.password = hashPassword;
    user.resetCode = null;
    await user.save();

    // await signup.updateOne({ _id: id }, { $set: { password: hashPassword } });
    res.render("successfullmsg", {
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = resetPassword;
