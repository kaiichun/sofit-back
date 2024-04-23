const express = require("express");
const router = express.Router();

const PMS = require("../models/pms.js");
const User = require("../models/user.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");

router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const data = await PMS.findOne({ _id: request.params.id });
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

router.get("/", async (request, response) => {
  try {
    const { month } = request.query;
    let filter = {};

    if (month) {
      filter.month = month;
    }

    response.status(200).send(await PMS.find(filter).sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: "Product not found" });
  }
});

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newPMS = new PMS({
      month: request.body.month,
      week: request.body.week,
      year: request.body.year,
      renewalAndReferred1: request.body.renewalAndReferred1,
      renewalAndReferred2: request.body.renewalAndReferred2,
      renewalAndReferred3: request.body.renewalAndReferred3,
      renewalAndReferred4: request.body.renewalAndReferred4,
      renewalAndReferred5: request.body.renewalAndReferred5,
      sA1InternalMeeting1: request.body.sA1InternalMeeting1,
      sA1InternalMeeting2: request.body.sA1InternalMeeting2,
      sA1InternalMeeting3: request.body.sA1InternalMeeting3,
      sA1InternalMeeting4: request.body.sA1InternalMeeting4,
      sA1InternalMeeting5: request.body.sA1InternalMeeting5,
      sA2InternalTraining1: request.body.sA2InternalTraining1,
      sA2InternalTraining2: request.body.sA2InternalTraining2,
      sA2InternalTraining3: request.body.sA2InternalTraining3,
      sA2InternalTraining4: request.body.sA2InternalTraining4,
      sA2InternalTraining5: request.body.sA2InternalTraining5,
      sA3CSAR: request.body.sA3CSAR,
      sA4Testimonials1: request.body.sA4Testimonials1,
      sA4Testimonials2: request.body.sA4Testimonials2,
      sA5RenewalAndReferred1: request.body.sA5RenewalAndReferred1,
      sA5RenewalAndReferred2: request.body.sA5RenewalAndReferred2,
      sA5RenewalAndReferred3: request.body.sA5RenewalAndReferred3,
      sA5RenewalAndReferred4: request.body.sA5RenewalAndReferred4,
      contribution: request.body.contribution,
      commitment: request.body.commitment,
      sBe1Enrolment: request.body.sBe1Enrolment,
      enrolmentGoogleReview: request.body.enrolmentGoogleReview,
      enrolmentInvitingClients: request.body.enrolmentInvitingClients,
      enrolmentInterviewingClients: request.body.enrolmentInterviewingClients,
      enrolmentIGStory: request.body.enrolmentIGStory,
      enrolmentIGFBPost: request.body.enrolmentIGFBPost,
      enrolmentNewCoaches: request.body.enrolmentNewCoaches,
      sBe2Engagement: request.body.sBe2Engagement,
      engagementSOFITevent: request.body.engagementSOFITevent,
      engagementIGStory: request.body.engagementIGStory,
      engagementIGFBPost: request.body.engagementIGFBPost,
      engagementVideoShooting: request.body.engagementVideoShooting,
      engagementTeamBuilding: request.body.engagementTeamBuilding,
      engagementSuggestion: request.body.engagementSuggestion,
      engagementRepostStory: request.body.engagementRepostStory,
      sBe5Core: request.body.sBe5Core,
      additional1: request.body.additional1,
      additional2: request.body.additional2,
      additional3: request.body.additional3,
      sectionA: request.body.sectionA,
      sectionB: request.body.sectionB,
      bonus: request.body.bonus,
      total: request.body.total,
      user: request.user,
    });
    const savedPMS = await newPMS.save();
    response.status(200).send(savedPMS);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const pmsID = await PMS.findById(request.params.id).populate("user");
    if (request.user.id === pmsID.user.id) {
      const updatedPMS = await PMS.findByIdAndUpdate(pmsID, request.body, {
        new: true,
      });
      response.status(200).send(updatedPMS);
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    const pms = await PMS.findById(request.params.id);
    const user = await User.findById(request.params.id);
    await PMS.findByIdAndDelete(request.params.id);
    response.status(200).send("staff pms has been deleted.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
