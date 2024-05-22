const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const branchSchema = new Schema({
  branch: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  hp: {
    type: String,
    required: true,
  },
  ssm: {
    type: String,
  },
  // one to many
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  //   order: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Order",
  //     },
  //   ],
  //   orderPackage: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "OrderPackage",
  //     },
  //   ],
  //   wage: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Wage",
  //     },
  //   ],
  //   pms: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Wage",
  //     },
  //   ],
});

const Branch = model("Branch", branchSchema);
module.exports = Branch;
