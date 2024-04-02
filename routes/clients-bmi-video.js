const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientvideo/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("clientVideo"), async (request, response) => {
  try {
    const clientvideo_url = request.file.path;
    response.status(200).send({ clientvideo_url: clientvideo_url });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
