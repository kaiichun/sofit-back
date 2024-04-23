const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = require("./product");
const userSchema = require("./user");
const clientSchema = require("./client");

const orderSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid", "Failed", "Shipped", "Delivered"],
  },
  invoiceNo: {
    type: String,
  },
  commission: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  paid_at: {
    type: Date,
  },
  month: {
    type: String,
    require: true,
  },
});

const Order = model("Order", orderSchema);
module.exports = Order;
