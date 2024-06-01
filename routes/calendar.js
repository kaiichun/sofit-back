const express = require("express");
const router = express.Router();
const Client = require("../models/client.js");
const Calendar2 = require("../models/calendar.js");
const User = require("../models/user.js");
const authMiddleware = require("../middleware/auth.js");

router.get("/", async (req, res) => {
  try {
    const events = await Calendar2.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newCalendar = new Calendar2({
      title: request.body.title,
      clientId: request.body.clientId,
      startTime: request.body.startTime,
      endTime: request.body.endTime,
      user: request.user.id,
      appointmentDate: request.body.appointmentDate,
    });

    const client = await Client.findById(request.body.clientId);

    if (client.sessions > 0) {
      client.sessions--;
    } else {
      return response
        .status(400)
        .json({ message: "Please top up your package" });
    }
    if (!client) {
      return response.status(404).json({ message: "Client not found" });
    }

    const savedClientActivity = await Promise.all([
      newCalendar.save(),
      client.save(),
    ]);

    response.status(200).send(savedClientActivity);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.post("/staff-activity", authMiddleware, async (req, res) => {
  try {
    const newActivity = new User({
      user: req.user,
      activity: req.body.activity,
      start: req.body.start,
      end: req.body.end,
      describe: req.body.describe,
    });

    const savedActivity = await newActivity.save();

    res.status(200).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const clientID = await Calendar2.findById(request.params.id).populate(
      "user"
    );

    const updatedClientBmi = await Calendar2.findByIdAndUpdate(
      clientID,
      request.body,
      {
        new: true,
      }
    );
    response.status(200).send(updatedClientBmi);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Calendar2.findOne({ _id: request.params.id }).populate(
      "user"
    );
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    // Find and delete the event
    const deletedEvent = await Calendar2.findByIdAndRemove(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the associated client
    const client = await Client.findById(deletedEvent.clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Increment sessions count
    client.sessions++;

    // Save the updated client
    await client.save();

    // Respond with success message
    res.status(200).json("Event has been canceled, session restored");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
