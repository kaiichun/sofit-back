const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
    unlikes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Draft", "Publish"],
      default: "Draft",
      required: true,
    },
  },
  { timestamps: true }
);

const PostContent = model("Post", postSchema);
module.exports = PostContent;
