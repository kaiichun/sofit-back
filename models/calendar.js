const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const calendar2Schema = new Schema({
  title: {
    type: String,
    enum: ["Meeting", "Coaching"],
    default: "Coaching",
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coachingId: {
    // Ensure the field name is correct
    type: Schema.Types.ObjectId,
    ref: "Coaching",
  },
  startTime: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
  },
});

const Calendar2 = model("Calendar2", calendar2Schema);
module.exports = Calendar2;
