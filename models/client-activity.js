const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const clientActivitySchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clientTitle: {
      type: String,
      required: true,
    },
    clientStart: {
      type: Date,
      required: true,
    },
    clientEnd: {
      type: Date,
      required: true,
    },
    clientDescribe: { type: String },
  },
  { timestamps: true }
);

const ClientActivity = model("ClientActivity", clientActivitySchema);
module.exports = ClientActivity;
