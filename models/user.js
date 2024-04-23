const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ic: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
      required: true,
    },
    relationship: {
      type: String,
      enum: ["Single", "In love", "Married", "Widowed", "Others"],
      default: "Single",
      required: true,
    },
    phonenumber: {
      type: Number,
      required: true,
    },
    staffemergencycontactname: {
      type: String,
      required: true,
    },
    staffemergencycontact: {
      type: Number,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      default: "-",
    },
    zip: {
      type: Number,
      required: true,
    },
    state: {
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
    image: {
      type: String,
      required: true,
    },
    bankname: {
      type: String,
      required: true,
    },
    bankacc: {
      type: String,
      required: true,
    },
    epf: {
      type: String,
      required: true,
    },
    socso: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      enum: [
        "Management",
        "Junior Trainee",
        "Senior Trainee",
        "Advanced Senior Trainee",
        "Sales",
        "Marketing",
        "Accounting",
        "Other",
      ],
      required: true,
      default: "Coach",
    },
    branch: {
      type: String,
      enum: ["Setia Alam", "Other"],
      default: "Setia Alam",
      required: true,
    },
    role: {
      type: String,
      enum: ["Staff", "Supervisor", "Manager", "Admin HQ", "Admin Branch"],
      default: "Staff",
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
