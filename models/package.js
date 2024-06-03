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
    enum: [
      "Junior Coach",
      "Senior Coach",
      "Advanced Senior Coach",
      "Master Coach",
    ],
    default: "Junior Coach",
  },

  valiMonth: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
});

const Package = model("Package", packageSchema);
module.exports = Package;
