const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientImageRight/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("clientImageRight"),
  async (request, response) => {
    try {
      const clientimageright_url = request.file.path;
      response.status(200).send({ clientimageright_url: clientimageright_url });
    } catch (error) {
      response.status(400).send({ message: error._message });
    }
  }
);

module.exports = router;
