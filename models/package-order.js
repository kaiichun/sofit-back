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
});

const OrderPackage = model("OrderPackage", orderPackageSchema);
module.exports = OrderPackage;
