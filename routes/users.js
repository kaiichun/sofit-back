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

module.exports = router;
