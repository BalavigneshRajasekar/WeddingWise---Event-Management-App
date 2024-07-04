const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  budget: {
    type: Number,
    default: 0,
  },
  budgetLeft: {
    type: Number,
    default: 0,
  },
  budgetSpent: {
    type: Number,
    default: 0,
  },
  resetCode: {
    type: String,
    default: null,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
