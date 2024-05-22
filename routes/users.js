const express = require("express");
const router = express.Router();
// const axios = require("axios");

// const Video = require("../models/video.js");
const User = require("../models/user.js");
// const PostContent = require("../models/post.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");
const PostContent = require("../models/post.js");

router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    response.status(200).send(user);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/", async (request, response) => {
  try {
    response.status(200).send(await User.find().sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  if (request.params.id === request.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        request.params.id,
        {
          $set: request.body,
        },
        { new: true }
      );
      response.status(200).send(updatedUser);
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }
});

router.put("/like/:postId", authMiddleware, async (request, response) => {
  const user = request.user.id;
  const postId = request.params.postId;
  try {
    const newPost = await PostContent.findById(postId);
    if (!newPost.likes.includes(user)) {
      newPost.likes.push(user);
      const index = newPost.unlikes.indexOf(user);
      if (index !== -1) {
        newPost.unlikes.splice(index, 1);
      }
      await newPost.save();
      response.status(200).send("Like");
    } else {
      response.status(200).send("Already Like");
    }
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.put("/unlike/:postId", authMiddleware, async (request, response) => {
  const user = request.user.id;
  const postId = request.params.postId;
  try {
    const newPost = await PostContent.findById(postId);

    if (!newPost.unlikes.includes(user)) {
      newPost.unlikes.push(user);
      const index = newPost.likes.indexOf(user);
      if (index !== -1) {
        newPost.likes.splice(index, 1);
      }
      await newPost.save();
      response.status(200).send("Unlike");
    } else {
      response.status(200).send("Already Unlike");
    }
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

module.exports = router;
