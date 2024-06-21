const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Client = require("../models/client.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newClient = new Client({
      user: request.user,
      clientName: request.body.clientName,
      clientGender: request.body.clientGender,
      clientIc: request.body.clientIc,
      clientHeight: request.body.clientHeight,
      clientWeight: request.body.clientWeight,
      clientEmail: request.body.clientEmail,
      clientPhonenumber: request.body.clientPhonenumber,
      clientEmergencycontactname: request.body.clientEmergencycontactname,
      clientEmergencycontact: request.body.clientEmergencycontact,
      clientAddress1: request.body.clientAddress1,
      clientAddress2: request.body.clientAddress2,
      clientZip: request.body.clientZip,
      clientState: request.body.clientState,
      exeQ1: request.body.exeQ1,
      exeQ2: request.body.exeQ2,
      exeQ3a: request.body.exeQ3a,
      exeQ3b: request.body.exeQ3b,
      exeQ3c: request.body.exeQ3c,
      exeQ3d: request.body.exeQ3d,
      dietQ1: request.body.dietQ1,
      dietQ2: request.body.dietQ2,
      dietQ3: request.body.dietQ3,
      dietQ4: request.body.dietQ4,
      dietQ5: request.body.dietQ5,
      dietQ6: request.body.dietQ6,
      dietQ7: request.body.dietQ7,
      dietQ8: request.body.dietQ8,
      lifeQ1: request.body.lifeQ1,
      lifeQ2: request.body.lifeQ2,
      lifeQ3: request.body.lifeQ3,
      lifeQ4: request.body.lifeQ4,
      occupationQ1: request.body.occupationQ1,
      occupationQ2: request.body.occupationQ2,
      occupationQ3: request.body.occupationQ3,
      occupationQ4: request.body.occupationQ4,
      rQ1: request.body.rQ1,
      rQ2: request.body.rQ2,
      medQ1: request.body.medQ1,
      medQ2: request.body.medQ2,
      medQ3: request.body.medQ3,
      medQ4: request.body.medQ4,
      medQ5: request.body.medQ5,
      addNote: request.body.addNote,
      packageValidityPeriod: request.body.packageValidityPeriod,
      coachId: request.body.coachId,
      coachName: request.body.coachName,
      branch: request.body.branch,
      clientImage: request.body.clientImage,
    });
    await newClient.save();
    response.status(200).send(newClient);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/", async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.clientName = { $regex: keyword, $options: "i" };
    }
    response
      .status(200)
      .send(await Client.find(filter).populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/client_studio", authMiddleware, async (request, response) => {
  try {
    let filter = {};
    if (request.user && request.user.role === "Staff") {
      filter.user = request.user._id;
    }
    response
      .status(200)
      .send(await Client.find(filter).populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Client.findOne({ _id: request.params.id }).populate(
      "user"
    );
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const clientID = await Client.findById(request.params.id).populate("user");
    const updatedClient = await Client.findByIdAndUpdate(
      clientID,
      request.body,
      {
        new: true,
      }
    );
    response.status(200).send(updatedClient);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const clientID = request.params.id;

    const client = await Client.findById(clientID).populate("user");
    if (request.user.id === client.user._id.toString()) {
      await Client.findByIdAndDelete(clientID);
    }
    response.status(200).send(client);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    const clientID = request.params.id;
    const client = await Client.findById(clientID).populate("user");
    await Client.findByIdAndDelete(clientID);
    response.status(200).send(client);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
