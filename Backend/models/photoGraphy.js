const mongoose = require("mongoose");

const photographySchema = new mongoose.Schema({
  photographyName: {
    type: String,
    required: true,
  },
  photographyImages: {
    type: [String],
  },
  photographyDescription: {
    type: String,
    required: true,
  },
  photographyAddress: {
    type: String,
    required: true,
  },
  photographyCity: {
    type: String,
    required: true,
  },
  photographyContact: {
    type: String,
    required: true,
  },
  bookedOn: {
    //both dates and user
    type: [Object],
    default: [],
  },
  bookedBy: {
    type: [String],
    default: [],
  },
  photographyType: {
    type: [String],
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});

const Photography = mongoose.model("Photography", photographySchema);

module.exports = Photography;
