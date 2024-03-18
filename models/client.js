const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const clientSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientGender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
      required: true,
    },
    clientIc: {
      type: String,
      required: true,
    },
    clientHeight: {
      type: Number,
      required: true,
    },
    clientWeight: {
      type: Number,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
      unique: true,
    },
    clientPhonenumber: {
      type: Number,
      required: true,
    },
    clientEmergencycontactname: {
      type: String,
      required: true,
    },
    clientEmergencycontact: {
      type: Number,
      required: true,
    },
    clientAddress1: {
      type: String,
      required: true,
    },
    clientAddress2: {
      type: String,
    },
    clientZip: {
      type: Number,
      required: true,
    },
    clientState: {
      type: String,
      enum: [
        "Selangor",
        "Perak",
        "Pahang",
        "Pulau Pinang",
        "Perlis",
        "Kelantan",
        "Kedah",
        "Johor",
        "Melaka",
        "Negeri Sembilan",
        "Terengganu",
        "W.P.Labuan",
        "W.P.Kualu Lumpur",
        "Sabah",
        "Sarawak",
      ],
      required: true,
      default: "Selangor",
    },
    exeQ1: {
      type: String,
      required: true,
    },
    exeQ2: {
      type: String,
      required: true,
    },
    exeQ3a: {
      type: String,
      required: true,
    },
    exeQ3b: {
      type: String,
      required: true,
    },
    exeQ3c: {
      type: String,
      required: true,
    },
    exeQ3d: {
      type: String,
      required: true,
    },
    dietQ1: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      required: true,
    },
    dietQ2: {
      type: String,
      required: true,
    },
    dietQ3: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    dietQ4: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    dietQ5: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    dietQ6: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      required: true,
    },
    dietQ7: {
      type: String,
      required: true,
    },
    dietQ8: {
      type: String,
      required: true,
    },
    lifeQ1: {
      type: String,
      required: true,
    },
    lifeQ2: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      required: true,
    },
    lifeQ3: {
      type: String,
      required: true,
    },
    lifeQ4: {
      type: String,
      required: true,
    },
    occupationQ1: {
      type: String,
      required: true,
    },
    occupationQ2: {
      type: String,
      required: true,
    },
    occupationQ3: {
      type: String,
      required: true,
    },
    occupationQ4: {
      type: String,
      required: true,
    },
    rQ1: {
      type: String,
      required: true,
    },
    rQ2: {
      type: String,
      required: true,
    },
    medQ1: {
      type: String,
      required: true,
    },
    medQ2: {
      type: String,
      required: true,
    },
    medQ3: {
      type: String,
      required: true,
    },
    medQ4: {
      type: String,
      required: true,
    },
    medQ5: {
      type: String,
      required: true,
    },
    addNote: {
      type: String,
      default: "-",
    },
    packageValidityPeriod: {
      type: String,
      required: true,
    },
    clientPackage: { type: String, required: true },
    sessions: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Client = model("Client", clientSchema);
module.exports = Client;
