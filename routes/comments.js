const express = require("express");
const router = express.Router();

const Comment = require("../models/comment.js");
const PostContent = require("../models/post.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");

router.post("/add", authMiddleware, async (request, response) => {
  try {
    const newComment = new Comment({
      comments: request.body.comments,
      postId: request.body.postId,
      user: request.user.id,
    });
    const savedComment = await newComment.save();
    response.status(200).send(savedComment);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    console.log(comment);
    const post = await PostContent.findById(request.params.id);
    if (
      request.user.id === comment.user.toString() ||
      request.user.id === post.user.toString()
    ) {
      await Comment.findByIdAndDelete(request.params.id);
      response.status(200).send("The comment has been deleted.");
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    const post = await PostContent.findById(request.params.id);
    await Comment.findByIdAndDelete(request.params.id);
    response.status(200).send("The comment has been deleted.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:postId", async (request, response) => {
  try {
    const comments = await Comment.find({
      postId: request.params.postId,
    })
      .populate("user")
      .sort({ _id: -1 });
    response.status(200).send(comments);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
