const mongoose = require("mongoose");

const mallsSchema = new mongoose.Schema({
  mallName: {
    type: String,
    required: true,
  },
  mallAddress: {
    type: String,
    required: true,
  },
  mallCity: {
    type: String,
    required: true,
  },
  mallContact: {
    type: String,
    required: true,
  },

  bookedOn: {
    type: Date,
    default: null,
  },
  BookedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  available: {
    type: Boolean,
    default: true,
  },
  spacing: {
    type: String,
    default: "500-1000",
  },
  amenities: {
    type: Array,
    default: [],
  },
  Price: {
    type: Number,
    default: 20000,
  },
});

const Malls = mongoose.model("Malls", mallsSchema);

module.exports = Malls;
