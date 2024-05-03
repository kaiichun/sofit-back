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
      default: "clientImageFront/sofit-white.png",
    },
    clientImageBack: {
      type: String,
      default: "clientImageBack/sofit-white.png",
    },
    clientImageLeft: {
      type: String,
      default: "clientImageLeft/sofit-white.png",
    },
    clientImageRight: {
      type: String,
      default: "clientImageRight/sofit-white.png",
    },

    clientVideo: {
      type: String,
      default: "clientVideo/sofit-white.png",
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
