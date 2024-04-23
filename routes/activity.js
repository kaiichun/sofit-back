const express = require("express");
const router = express.Router();

const ClientActivity = require("../models/client-activity");
const Client = require("../models/client.js");
const UserActivity = require("../models/user-activity");
const User = require("../models/user.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");

router.get("/", async (req, res) => {
  try {
    const events = await Client.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newClientActivity = new ClientActivity({
      title: request.body.title,
      start: request.body.start,
      end: request.body.end,
      allDay: request.body.allDay,
      resource: request.body.resource,
      clientId: request.body.clientId,
      user: request.user.id,
    });

    const client = await Client.findById(request.body.clientId);

    // if (client.sessions > 0) {
    //   client.sessions--;
    // } else {
    //   return response
    //     .status(400)
    //     .json({ message: "Please top up your package" });
    // }
    // if (!client) {
    //   return response.status(404).json({ message: "Client not found" });
    // }

    const savedClientActivity = await Promise.all([
      newClientActivity.save(),
      client.save(),
    ]);
    response.status(200).send(savedClientActivity);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/clients/:clientID", authMiddleware, async (request, response) => {
  try {
    const clientID = await ClientActivity.findById(request.params.id).populate(
      "user"
    );
    if (request.user.id === clientID.user.id) {
      const updatedClientBmi = await ClientActivity.findByIdAndUpdate(
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

router.delete("/clients/:id", authMiddleware, async (request, response) => {
  try {
    const clientActivity = await ClientActivity.findById(request.params.id);
    console.log(clientActivity);
    const client = await Client.findById(request.params.id);
    if (
      request.user.id === clientActivity.user.toString() ||
      request.user.id === client.user.toString()
    ) {
      await ClientActivity.findByIdAndDelete(request.params.id);
      response.status(200).send("The client info has been deleted.");
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete(
  "/clients/admin/:id",
  isAdminMiddleware,
  async (request, response) => {
    try {
      const clientActivity = await ClientActivity.findById(request.params.id);
      const client = await Client.findById(request.params.id);
      await ClientActivity.findByIdAndDelete(request.params.id);
      response.status(200).send("The client info has been deleted.");
    } catch (error) {
      response.status(400).send({ message: error._message });
    }
  }
);

router.get("/:clientId", async (request, response) => {
  try {
    const clientActivity = await ClientActivity.find({
      clientId: request.params.clientId,
    })
      .populate("user")
      .sort({ _id: -1 });
    response.status(200).send(clientActivity);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
