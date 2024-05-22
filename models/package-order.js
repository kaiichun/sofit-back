const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = require("./product");
const userSchema = require("./user");
const clientSchema = require("./client");

const orderPackageSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  packages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Package",
    },
  ],
  paymentMethod: {
    type: String,
    default: "Full payment",
    enum: ["Full payment", "Installment"],
  },
  installmentMonth: {
    type: Number,
    default: 1,
    enum: [1, 2, 3],
  },
  installmentAmount1: {
    type: Number,
  },
  installmentAmount2: {
    type: Number,
  },
  installmentAmount3: {
    type: Number,
  },
  outstanding: {
    type: Number,
  },
  tax: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
  },
  paid_at: {
    type: Date,
    required: true,
  },
  month: {
    type: String,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  day: {
    type: String,
    require: true,
  },
});

const OrderPackage = model("OrderPackage", orderPackageSchema);
module.exports = OrderPackage;
