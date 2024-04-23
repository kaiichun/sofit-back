const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");
const pmsSchema = require("./pms");
const orderSchema = require("./order");

const wageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    pms: {
      type: Schema.Types.ObjectId,
      ref: "PMS",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    basic: {
      type: Number,
      require: true,
    },
    month: {
      type: Date,
      require: true,
    },
    year: {
      type: Date,
      require: true,
    },
    coachingFee: {
      type: Number,
      require: true,
    },
    epf: {
      type: Number,
      require: true,
    },
    socso: {
      type: Number,
      require: true,
    },
    eis: {
      type: Number,
      require: true,
    },
    pcd: {
      type: Number,
      require: true,
    },
    allowance: {
      type: Number,
      require: true,
    },
    claims: {
      type: Number,
      require: true,
    },
    employerEpf: {
      type: Number,
      require: true,
    },
    employerSocso: {
      type: Number,
      require: true,
    },
    employerEis: {
      type: Number,
      require: true,
    },
    totalIncome: {
      type: Number,
      require: true,
    },
    overtime: { type: Number, require: true },
    totalDeduction: {
      type: Number,
      require: true,
    },
    nettPay: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const Wage = model("Wage", wageSchema);
module.exports = Wage;
