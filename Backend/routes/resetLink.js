const express = require("express");
const nodeMailer = require("nodemailer");
const mailDesign = require("mailgen");
const signup = require("../models/users");
const Jwt = require("jsonwebtoken");
require("dotenv").config();

const resetRouter = express.Router();
//FUnction for create Random string
function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
//Api to generate random string code for reset password
resetRouter.post("/resetLink", async (req, res) => {
  const { userMail } = req.body;

  const code = randomString(5);
  try {
    //Mail design
    const mailCheck = await signup.findOne({ email: userMail });
    if (!mailCheck) {
      return res.status(400).json({ message: "Email does not exists" });
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
        name: mailCheck.name,
        intro: `verification code ${code}`,
        greeting: `Find your Verification code below`,
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
      to: userMail,
      subject: "Hi Security code",
      text: "Hi find your security code here",
      html: mail,
    };

    // create Json web Toke for links expiry

    const token = Jwt.sign(
      { id: mailCheck._id, name: mailCheck.name },
      process.env.JWTSECRET,
      {
        expiresIn: "180s",
      }
    );

    transporter
      .sendMail(messages)
      .then((info) => {
        mailCheck.resetCode = code;
        mailCheck.save();
        res
          .status(200)
          .json({ message: "Verification code sent", data: token });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "error sending mail " + err.message });
      });
  } catch (err) {
    res.status(500).json({ message: "server error " });
  }
});

module.exports = resetRouter;
