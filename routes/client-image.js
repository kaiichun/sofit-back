const express = require("express");
const router = express.Router();
const multer = require("multer");

// Setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientImage/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("clientImage"), (request, response) => {
  if (!request.file) {
    return response.status(400).send({ message: "No file uploaded" });
  }

  const clientImage_url = request.file.path;
  response.status(200).send({ clientImage_url: clientImage_url });
});

module.exports = router;
