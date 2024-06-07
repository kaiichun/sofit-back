const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const clientSchema = new Schema(
  {
    clientName: {
      type: String,
    },
    clientImage: {
      type: String,
    },
    clientGender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    clientIc: {
      type: String,
    },
    clientHeight: {
      type: Number,
    },
    clientWeight: {
      type: Number,
    },
    clientEmail: {
      type: String,
      unique: true,
    },
    clientPhonenumber: {
      type: String,
    },
    clientEmergencycontactname: {
      type: String,
    },
    clientEmergencycontact: {
      type: String,
    },
    clientAddress1: {
      type: String,
    },
    clientAddress2: {
      type: String,
    },
    clientZip: {
      type: String,
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
      default: "Selangor",
    },
    exeQ1: {
      type: String,
    },
    exeQ2: {
      type: String,
    },
    exeQ3a: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    exeQ3b: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    exeQ3c: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    exeQ3d: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    dietQ1: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    dietQ2: {
      type: String,
    },
    dietQ3: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    dietQ4: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    dietQ5: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    dietQ6: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    dietQ7: {
      type: String,
    },
    dietQ8: {
      type: String,
    },
    lifeQ1: {
      type: String,
    },
    lifeQ2: {
      type: String,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
    lifeQ3: {
      type: String,
    },
    lifeQ4: {
      type: String,
    },
    occupationQ1: {
      type: String,
    },
    occupationQ2: {
      type: String,
    },
    occupationQ3: {
      type: String,
    },
    occupationQ4: {
      type: String,
    },
    rQ1: {
      type: String,
    },
    rQ2: {
      type: String,
    },
    medQ1: {
      type: String,
    },
    medQ2: {
      type: String,
    },
    medQ3: {
      type: String,
    },
    medQ4: {
      type: String,
    },
    medQ5: {
      type: String,
    },
    addNote: {
      type: String,
      default: "-",
    },
    sessions: { type: Number, default: 0 },
    packageValidityPeriod: { type: Date, default: new Date() },
    totalSpend: { type: Number, default: 0 },
    coachId: {
      type: String,
    },
    coachName: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

const Client = model("Client", clientSchema);
module.exports = Client;
