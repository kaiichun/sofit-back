const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "clientImageLeft/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("clientImageLeft"),
  async (request, response) => {
    try {
      const clientimageleft_url = request.file.path;
      response.status(200).send({ clientimageleft_url: clientimageleft_url });
    } catch (error) {
      response.status(400).send({ message: error._message });
    }
  }
);

module.exports = router;
