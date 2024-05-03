const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const pmsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    month: {
      type: String,
      require: true,
    },
    // week: {
    //   type: String,
    //   require: true,
    // },
    year: {
      type: String,
      require: true,
    },
    renewalAndReferred1: {
      type: String,
    },
    renewalAndReferred2: {
      type: String,
    },
    renewalAndReferred3: {
      type: String,
    },
    renewalAndReferred4: {
      type: String,
    },
    renewalAndReferred5: {
      type: String,
    },
    sA1InternalMeeting1: {
      type: String,
    },
    sA1InternalMeeting2: {
      type: String,
    },
    sA1InternalMeeting3: {
      type: String,
    },
    sA1InternalMeeting4: {
      type: String,
    },
    sA1InternalMeeting5: {
      type: String,
    },
    sA2InternalTraining1: {
      type: String,
    },
    sA2InternalTraining2: {
      type: String,
    },
    sA2InternalTraining3: {
      type: String,
    },
    sA2InternalTraining4: {
      type: String,
    },
    sA2InternalTraining5: {
      type: String,
    },
    sA3CSAR: {
      type: String,
    },
    commitment: {
      type: String,
    },
    contribution: {
      type: String,
    },
    sA4Testimonials1: {
      type: String,
    },
    sA4Testimonials2: {
      type: String,
    },
    sA5RenewalAndReferred1: {
      type: String,
    },
    sA5RenewalAndReferred2: {
      type: String,
    },
    sA5RenewalAndReferred3: {
      type: String,
    },
    sA5RenewalAndReferred4: {
      type: String,
    },

    sBe1Enrolment: {
      type: String,
    },
    enrolmentGoogleReview: {
      type: String,
    },
    enrolmentInvitingClients: {
      type: String,
    },
    enrolmentInterviewingClients: {
      type: String,
    },
    enrolmentIGStory: {
      type: String,
    },
    enrolmentIGFBPost: {
      type: String,
    },
    enrolmentNewCoaches: {
      type: String,
    },
    sBe2Engagement: {
      type: String,
    },
    engagementSOFITevent: {
      type: String,
    },
    engagementIGStory: {
      type: String,
    },
    engagementIGFBPost: {
      type: String,
    },
    engagementVideoShooting: {
      type: String,
    },
    engagementTeamBuilding: {
      type: String,
    },
    engagementSuggestion: {
      type: String,
    },
    engagementRepostStory: {
      type: String,
    },
    sBe5Core: {
      type: String,
    },
    additional1: {
      type: String,
    },
    additional2: {
      type: String,
    },
    additional3: {
      type: String,
    },
    sectionA: {
      type: String,
    },
    sectionB: {
      type: String,
    },
    bonus: {
      type: String,
    },
    total: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const PMS = model("PMS", pmsSchema);
module.exports = PMS;
