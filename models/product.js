const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  productImage: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  commissionPercentage: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  store: {
    type: Number,
    required: true,
  },
});

const Product = model("Product", productSchema);
module.exports = Product;
