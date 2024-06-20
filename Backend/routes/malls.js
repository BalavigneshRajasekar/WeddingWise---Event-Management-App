const express = require("express");
const malls = require("../models/malls");
const loginAuth = require("../middlewares/loginAuth");
const roleAuth = require("../middlewares/roleAuth");

const mallsRouter = express.Router();

// endpoint to add mall to the DB
mallsRouter.post("/add", loginAuth, roleAuth("Admin"), async (req, res) => {
  const {
    mallName,
    mallAddress,
    mallCity,
    mallContact,
    spacing,
    amenities,
    Price,
  } = req.body;

  try {
    const verify = await malls.findOne({ mallContact: mallContact });
    if (verify) {
      return res.status(400).send({ message: "Mall already exists" });
    }
    const newMall = new malls({
      mallName,
      mallAddress,
      mallCity,
      mallContact,
      spacing,
      amenities: amenities.split(","),
      Price,
    });

    await newMall.save();

    res.status(200).send({ message: "Mall registered successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error: ", err: err.message });
  }
});

module.exports = mallsRouter;
