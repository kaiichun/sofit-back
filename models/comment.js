const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");
const postSchema = require("./post");

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
