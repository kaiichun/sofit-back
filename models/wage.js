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
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    payslipNo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    ic: {
      type: String,
      required: true,
    },
    totalpms: {
      type: Number,
    },
    // order: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Order",
    // },
    basic: {
      type: Number,
      require: true,
    },
    month: {
      type: String,
      require: true,
    },
    year: {
      type: String,
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
    },
    allowance: {
      type: Number,
    },
    claims: {
      type: Number,
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
    overtime: { type: Number },

    totalDeduction: {
      type: Number,
    },
    commission: {
      type: Number,
    },
    nettPay: {
      type: Number,
    },
    bankname: {
      type: String,
      required: true,
    },
    bankacc: {
      type: String,
      required: true,
    },
    epfNo: {
      type: String,
      required: true,
    },
    socsoNo: {
      type: String,
      required: true,
    },
    eisNo: {
      type: Number,
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

const Wage = model("Wage", wageSchema);
module.exports = Wage;
