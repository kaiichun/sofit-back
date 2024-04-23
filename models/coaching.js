const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");
const pmsSchema = require("./pms");

const coachingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    day: { type: Date, require: true },
    month: {
      type: Date,
      require: true,
    },
    year: {
      type: Date,
      require: true,
    },
    coachingFee: {
      type: String,
      require: true,
    },
    epf: {
      type: String,
      require: true,
    },
    socso: {
      type: String,
      require: true,
    },
    eis: {
      type: String,
      require: true,
    },
    pcd: {
      type: String,
    },
    allowance: {
      type: String,
    },
    comissions: {
      type: String,
    },
    claims: {
      type: String,
    },
    employerEpf: {
      type: String,
      require: true,
    },
    employerSocso: {
      type: String,
      require: true,
    },
    employerEis: {
      type: String,
      require: true,
    },
    totalIncome: {
      type: String,
      require: true,
    },
    totalDeduction: {
      type: String,
      require: true,
    },
    nettPay: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Coaching = model("Coaching", coachingSchema);
module.exports = Coaching;
