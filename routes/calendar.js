const express = require("express");
const router = express.Router();
const Client = require("../models/client.js");
const Calendar2 = require("../models/calendar.js");
const User = require("../models/user.js");
const authMiddleware = require("../middleware/auth.js");
const Coaching = require("../models/coaching.js");

router.get("/", async (req, res) => {
  try {
    const events = await Calendar2.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/coaching", async (req, res) => {
  try {
    const events = await Coaching.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (request, response) => {
  try {
    const { title, clientId, staffId, startTime, appointmentDate } =
      request.body;
    const userId = request.user.id;

    // Create a new calendar event
    const newCalendar = new Calendar2({
      title,
      clientId,
      startTime,
      staffId,
      user: userId,
      appointmentDate,
    });

    // Find the client by ID
    const client = await Client.findById(clientId);

    // Check if the client exists
    if (!client) {
      return response.status(404).json({ message: "Client not found" });
    }

    // Decrement the client's sessions count
    if (client.sessions > 0) {
      client.sessions--;
    } else {
      return response
        .status(400)
        .json({ message: "Please top up your package" });
    }

    // Find or create a new coaching entry for the user and client on the specified date
    const coachingDate = new Date(appointmentDate).setHours(0, 0, 0, 0);
    const existingCoaching = await Coaching.findOne({
      clientId,
      staffId,
      date: coachingDate,
    });

    if (existingCoaching) {
      existingCoaching.sessions++;
      await existingCoaching.save();
    } else {
      const newCoaching = new Coaching({
        user: userId,
        staffId,
        clientId,
        date: coachingDate,
        sessions: 1,
      });
      await newCoaching.save();
    }

    // Save the new calendar event and update the client
    await Promise.all([newCalendar.save(), client.save()]);

    response.status(200).json({ message: "Session booked successfully" });
  } catch (error) {
    response.status(400).send({ message: error.message });
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
