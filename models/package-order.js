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
  staffId: {
    type: String,
    require: true,
  },
  staffName: {
    type: String,
    require: true,
  },
  packages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Package",
    },
  ],
  discountRate: {
    type: Number,
    default: 0,
  },
  discount: { type: Number },
  payby: {
    type: String,
    default: "Bank Transfer",
    enum: [
      "Bank Transfer",
      "Cash",
      "Credit Card",
      "Debit Card",
      "E-Wallet",
      "Merchant Services",
    ],
  },
  paymentMethod: {
    type: String,
    default: "Full payment",
    enum: ["Full payment", "Installment"],
  },
  installmentMonth: {
    type: Number,
    default: 3,
    enum: [3, 6, 12],
  },
  installmentAmount: {
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
