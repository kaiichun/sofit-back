const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const clientSchema = require("./client");

const ClientBmiSchema = new Schema(
  {
    clientBmi: {
      type: String,
      required: true,
    },
    clientKg: {
      type: String,
      required: true,
    },
    clientBodyAge: {
      type: String,
      required: true,
    },
    clientVFat: {
      type: String,
      required: true,
    },
    clientBodyFat: {
      type: String,
      required: true,
    },
    clientImageFront: {
      type: String,
    },
    clientImageBack: {
      type: String,
    },
    clientImageLeft: {
      type: String,
    },
    clientImageRight: {
      type: String,
    },

    clientVideo: {
      type: String,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ClientBmi = model("Bmi", ClientBmiSchema);
module.exports = ClientBmi;
