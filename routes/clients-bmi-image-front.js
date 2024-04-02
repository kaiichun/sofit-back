const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientImageFront/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("clientImageFront"),
  async (request, response) => {
    try {
      const clientimagefront_url = request.file.path;
      response.status(200).send({ clientimagefront_url: clientimagefront_url });
    } catch (error) {
      response.status(400).send({ message: error._message });
    }
  }
);

module.exports = router;
