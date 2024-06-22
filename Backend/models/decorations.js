const mongoose = require("mongoose");

const decorSchema = new mongoose.Schema({
  decorName: {
    type: String,
    required: true,
  },
  decorImages: {
    type: [String],
  },
  DecorDescription: {
    type: String,
    required: true,
  },
  decorAddress: {
    type: String,
    required: true,
  },
  decorType: {
    type: [String],
    required: true,
  },
  decorCity: {
    type: String,
    required: true,
  },
  decorContact: {
    type: String,
    required: true,
  },
  bookedOn: {
    //both dates and user
    type: [Object],
    default: [],
  },
  Price: {
    type: Number,
    required: true,
  },
});

const Decor = mongoose.model("Decor", decorSchema);

module.exports = Decor;
