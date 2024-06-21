const express = require("express");
const router = express.Router();
const Client = require("../models/client.js");
const User = require("../models/user.js");
const authMiddleware = require("../middleware/auth.js");

router.get("/", async (req, res) => {
  try {
    const events = await Client.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Client.findById(id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newAppointments = new Client({
      user: req.user,
      appointment: req.body.appointment,
      sessions: req.body.sessions,
    });

    if (newAppointments.sessions > 0) {
      newAppointments.sessions--;
    }

    if (newAppointments.sessions === 0) {
      return res.status(400).json({ message: "Please top up your package" });
    }

    await newAppointments.save();

    res.status(200).json(newAppointments);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const clientID = await Client.findById(request.params.id).populate("user");
    if (request.user.id === clientID.user.id) {
      const updatedClientBmi = await Client.findByIdAndUpdate(
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

router.delete("/:id/delete", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedEvent = await Client.findByIdAndRemove(id);
    if (deletedEvent) {
      res.status(200).json("Event has been deleted");
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
