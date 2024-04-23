const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Client = require("../models/client.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");
const Wage = require("../models/wage.js");
const PMS = require("../models/pms.js");
const Order = require("../models/order.js");

router.post("/", isAdminMiddleware, async (request, response) => {
  try {
    // Check if the user making the request is an admin with the appropriate role
    const user = await User.findById(request.user);
    if (!user || !(user.role === "Admin Branch" || user.role === "Admin HQ")) {
      return response.status(403).json({
        message:
          "Only admin users with role 'Admin Branch' or 'Admin HQ' can create wages.",
      });
    }

    let selectedUser = null;
    if (request.body.user) {
      selectedUser = await User.findById(request.body.user);
      if (!selectedUser) {
        return response
          .status(404)
          .json({ message: "Selected user not found" });
      }
    }

    // Check if the provided pms and order IDs match the IDs of the selected user
    if (
      selectedUser &&
      (request.body.pms.user.toString() !== selectedUser._id.toString() ||
        request.body.order.user.toString() !== selectedUser._id.toString())
    ) {
      return response.status(400).json({
        message:
          "Provided PMS or Order ID does not match the selected user's ID.",
      });
    }

    // Create a new staff wage object
    const newStaffWage = new Wage({
      user: selectedUser ? selectedUser._id : null,
      pms: request.body.pms,
      order: request.body.order,
      month: request.body.month,
      year: request.body.year,
      basic: request.body.basic,
      coachingFee: request.body.coachingFee,
      epf: request.body.epf,
      socso: request.body.socso,
      eis: request.body.eis,
      pcd: request.body.pcd,
      allowance: request.body.allowance,
      claims: request.body.claims,
      employerEpf: request.body.employerEpf,
      employerSocso: request.body.employerSocso,
      employerEis: request.body.employerEis,
      totalIncome: request.body.totalIncome,
      overtime: request.body.overtime,
      nettPay: request.body.nettPay,
    });

    await newStaffWage.save();

    response.status(200).send(newStaffWage);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.get("/", async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.user.name = { $regex: keyword, $options: "i" };
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
    if (request.user.id === clientID.user.id) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientID,
        request.body,
        {
          new: true,
        }
      );
      response.status(200).send(updatedClient);
    }
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
