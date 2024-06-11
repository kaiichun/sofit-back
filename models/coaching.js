const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");
const pmsSchema = require("./pms");

const coachingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: { type: Date },
    sessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Coaching = model("Coaching", coachingSchema);
module.exports = Coaching;
