const express = require("express");
const router = express.Router();

const ClientBmi = require("../models/client-bmi");
const Client = require("../models/client.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newClientBmi = new ClientBmi({
      clientBmi: request.body.clientBmi,
      clientKg: request.body.clientKg,
      clientBodyAge: request.body.clientBodyAge,
      clientVFat: request.body.clientVFat,
      clientBodyFat: request.body.clientBodyFat,
      clientImageFront: request.body.clientImageFront,
      clientImageBack: request.body.clientImageBack,
      clientImageLeft: request.body.clientImageLeft,
      clientImageRight: request.body.clientImageRight,
      clientVideo: request.body.clientVideo,
      clientId: request.body.clientId,
      user: request.user,
    });
    const savedClientBmi = await newClientBmi.save();
    response.status(200).send(savedClientBmi);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const clientID = await ClientBmi.findById(request.params.id).populate(
      "user"
    );
    if (request.user.id === clientID.user.id) {
      const updatedClientBmi = await ClientBmi.findByIdAndUpdate(
        clientID,
        request.body,
        {
          new: true,
        }
      );
      response.status(200).send(updatedClientBmi);
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const clientBmi = await ClientBmi.findById(request.params.id);
    console.log(clientBmi);
    const client = await Client.findById(request.params.id);
    if (
      request.user.id === clientBmi.user.toString() ||
      request.user.id === client.user.toString()
    ) {
      await ClientBmi.findByIdAndDelete(request.params.id);
      response.status(200).send("The client info has been deleted.");
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    const clientBmi = await ClientBmi.findById(request.params.id);
    const client = await Client.findById(request.params.id);
    await ClientBmi.findByIdAndDelete(request.params.id);
    response.status(200).send("The client info has been deleted.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:clientId", async (request, response) => {
  try {
    const clientBmi = await ClientBmi.find({
      clientId: request.params.clientId,
    })
      .populate("user")
      .sort({ _id: -1 });
    response.status(200).send(clientBmi);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
