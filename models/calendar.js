const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const calendar2Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startTime: {
    type: String,
    require: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
});

const Calendar2 = model("Calendar2", calendar2Schema);
module.exports = Calendar2;
