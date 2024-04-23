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
    title: { type: String },
    start: { type: Date },
    end: { type: Date },
    allDay: { type: Boolean },
    resource: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const ClientActivity = model("ClientActivity", clientActivitySchema);
module.exports = ClientActivity;
