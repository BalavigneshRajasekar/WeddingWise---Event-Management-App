const express = require("express");
const Users = require("../models/users");
const loginAuth = require("../middlewares/loginAuth");

const budgetRouter = express.Router();

// endpoint to add budget to the DB

budgetRouter.post("/add", loginAuth, async (req, res) => {
  const { budget } = req.body;
  try {
    const user = await Users.findById(req.user.id);
    user.budget = budget;
    user.budgetLeft = budget;
    await user.save();
    res.status(200).json({ message: "Budget added successfully" });
  } catch (err) {
    res.status(500).send({ message: "server error", error: err });
  }
});

module.exports = budgetRouter;
