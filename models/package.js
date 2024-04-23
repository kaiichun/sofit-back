const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const packageSchema = new Schema({
  sofitpackage: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sessions: {
    type: Number,
    required: true,
  },

  // packageValidityPeriod: {
  //   type: Date,
  //   required: true,
  // },
  category: {
    type: String,
    required: true,
  },
});

const Package = model("Package", packageSchema);
module.exports = Package;
