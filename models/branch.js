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
});

const Branch = model("Branch", branchSchema);
module.exports = Branch;
