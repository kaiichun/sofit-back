const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientImage/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("clientImage"), async (request, response) => {
  try {
    const clientImage_url = request.file.path;
    response.status(200).send({ clientImage_url: clientImage_url });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
