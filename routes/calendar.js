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

// router.get("/", async (req, res) => {
//   try {
//     const events = await Calendar2.find({});
//     res.status(200).json(
//       events.map((e) => {
//         e.appointmentDate = moment(e.appointmentDate).add(8, "hour");
//         return e;
//       })
//     );
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/", authMiddleware, async (request, response) => {
//   try {
//     const { title, clientId, staffId, startTime, appointmentDate, branch } =
//       request.body;
//     const userId = request.user.id;

//     // Convert appointmentDate to a Date object if it's in string format
//     const appointmentDateUTC = new Date(appointmentDate);

//     // Create a new calendar event
//     const newCalendar = new Calendar2({
//       title,
//       clientId,
//       startTime,
//       staffId,
//       user: userId,
//       branch,
//       appointmentDate: appointmentDateUTC,
//     });

//     // Find the client by ID
//     const client = await Client.findById(clientId);

//     // Check if the client exists
//     if (!client) {
//       return response.status(404).json({ message: "Client not found" });
//     }

//     // Decrement the client's sessions count
//     if (client.sessions > 0) {
//       client.sessions--;
//     } else {
//       return response
//         .status(400)
//         .json({ message: "Please top up your package" });
//     }

//     // Find or create a new coaching entry for the user and client on the specified date
//     const coachingDate = new Date(appointmentDateUTC).setHours(0, 0, 0, 0);
//     const existingCoaching = await Coaching.findOne({
//       clientId,
//       staffId,
//       date: coachingDate,
//     });

//     if (existingCoaching) {
//       existingCoaching.sessions++;
//       await existingCoaching.save();
//     } else {
//       const newCoaching = new Coaching({
//         user: userId,
//         staffId,
//         clientId,
//         date: coachingDate,
//         sessions: 1,
//       });
//       await newCoaching.save();
//     }

//     // Save the new calendar event and update the client
//     await Promise.all([newCalendar.save(), client.save()]);

//     response.status(200).json({ message: "Session booked successfully" });
//   } catch (error) {
//     response.status(400).send({ message: error.message });
//   }
// });

router.post("/", authMiddleware, async (request, response) => {
  try {
    const { title, clientId, staffId, startTime, appointmentDate, branch } =
      request.body;
    const userId = request.user.id;

    const appointmentDateUTC = new Date(appointmentDate);
    console.log("appointmentDateUTC:", appointmentDateUTC);

    const client = await Client.findById(clientId);
    if (!client) {
      console.log("Client not found");
      return response.status(404).json({ message: "Client not found" });
    }

    if (client.sessions > 0) {
      client.sessions--;
    } else {
      console.log("Client sessions exhausted");
      return response
        .status(400)
        .json({ message: "Please top up your package" });
    }

    const coachingDate = new Date(appointmentDateUTC).setHours(0, 0, 0, 0);
    console.log("coachingDate:", coachingDate);

    let existingCoaching = await Coaching.findOne({
      clientId,
      staffId,
      date: coachingDate,
    });

    if (existingCoaching) {
      existingCoaching.sessions++;
      await existingCoaching.save();
      console.log("Updated existing coaching:", existingCoaching);
    } else {
      existingCoaching = new Coaching({
        user: userId,
        staffId,
        clientId,
        date: coachingDate,
        sessions: 1,
      });
      await existingCoaching.save();
      console.log("Created new coaching:", existingCoaching);
    }

    const newCalendar = new Calendar2({
      title,
      clientId,
      startTime,
      staffId,
      user: userId,
      branch,
      appointmentDate: appointmentDateUTC,
      coachingId: existingCoaching._id, // Pass the coachingId correctly
    });

    await Promise.all([newCalendar.save(), client.save()]);

    console.log("New calendar event created:", newCalendar);

    response.status(200).json({ message: "Session booked successfully" });
  } catch (error) {
    console.log("Error:", error);
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
    const { id } = request.params;
    const { title, clientId, staffId, startTime, appointmentDate, branch } =
      request.body;
    const userId = request.user.id;

    // Convert appointmentDate to a Date object if it's in string format
    const appointmentDateUTC = new Date(appointmentDate);

    // Find the calendar event by ID
    const calendarEvent = await Calendar2.findById(id);

    if (!calendarEvent) {
      return response.status(404).json({ message: "Appointment not found" });
    }

    // Retrieve the coachingId from the calendar event
    const coachingId = calendarEvent.coachingId;

    // Find the coaching entry by its ID
    const coachingEntry = await Coaching.findById(coachingId);

    if (!coachingEntry) {
      return response.status(404).json({ message: "Coaching entry not found" });
    }

    // Update the staffId in both calendarEvent and coachingEntry
    calendarEvent.title = title;
    calendarEvent.clientId = clientId;
    calendarEvent.staffId = staffId;
    calendarEvent.user = userId;
    calendarEvent.appointmentDate = appointmentDateUTC;
    calendarEvent.startTime = startTime;
    calendarEvent.branch = branch;

    coachingEntry.staffId = staffId;

    // Save both updated documents
    await Promise.all([calendarEvent.save(), coachingEntry.save()]);

    response
      .status(200)
      .json({ message: "Appointment and coaching updated successfully" });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { appointmentDate, startTime } = req.body;

  try {
    const updatedAppointment = await Calendar2.findByIdAndUpdate(
      id,
      { appointmentDate, startTime },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Calendar2.findOne({ _id: request.params.id }).populate(
      "user"
    );

    const existingEvent = await Calendar2.findById(request.params.id);

    if (!existingEvent) {
      return response.status(404).json({ message: "Event not found" });
    }

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

    // Find the associated coaching entry
    const coachingId = deletedEvent.coachingId;
    const deletedCoaching = await Coaching.findByIdAndRemove(coachingId);

    if (!deletedCoaching) {
      return res.status(404).json({ message: "Coaching entry not found" });
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
    res
      .status(200)
      .json("Event and coaching entry have been canceled, session restored");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
