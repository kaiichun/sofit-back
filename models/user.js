const mongoose = require("mongoose");
const Branch = require("./branch");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
    },
    ic: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    relationship: {
      type: String,
      enum: ["Single", "In love", "Married", "Widowed", "Others"],
      default: "Single",
    },
    phonenumber: {
      type: String,
    },
    staffemergencycontactname: {
      type: String,
    },
    staffemergencycontact: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
      default: "-",
    },
    zip: {
      type: String,
    },
    state: {
      type: String,
      enum: [
        "Selangor",
        "Perak",
        "Pahang",
        "Pulau Pinang",
        "Perlis",
        "Kelantan",
        "Kedah",
        "Johor",
        "Melaka",
        "Negeri Sembilan",
        "Terengganu",
        "W.P.Labuan",
        "W.P.Kualu Lumpur",
        "Sabah",
        "Sarawak",
      ],
      default: "Selangor",
    },
    image: {
      type: String,
    },
    bankname: {
      type: String,
    },
    bankacc: {
      type: String,
    },
    epf: {
      type: String,
    },
    socso: {
      type: String,
    },
    salary: {
      type: String,
    },
    department: {
      type: String,
      enum: [
        "Management",
        "Junior Coach",
        "Senior Coach",
        "Advanced Senior Coach",
        "Master Coach",
        "Sales",
        "Marketing",
        "Accounting",
        "Other",
      ],
      default: "Junior Trainee",
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },
    role: {
      type: String,
      enum: ["Staff", "Supervisor", "Manager", "Admin HQ", "Admin Branch"],
      default: "Staff",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// userSchema.post("save", async function () {
//   // retrieve the current id that is updated
//   const userID = this._id;
//   const branchID = this.branch;
//   // find the selected category
//   const selectedBranch = await Branch.findById(branchID);
//   // add the task into the selected category
//   selectedBranch.user.push(userID);
//   // save the category
//   await selectedBranch.save();
// });

// Post-hook to handle branch change
userSchema.post("save", async function () {
  const userID = this._id;
  const branchID = this.branch;
  const previousBranchID = this._previousBranch;

  if (previousBranchID && !previousBranchID.equals(branchID)) {
    // Remove user from the previous branch
    const previousBranch = await Branch.findById(previousBranchID);
    if (previousBranch) {
      previousBranch.user.pull(userID);
      await previousBranch.save();
    }
  }

  if (branchID) {
    // Add user to the new branch
    const selectedBranch = await Branch.findById(branchID);
    if (selectedBranch) {
      selectedBranch.user.addToSet(userID);
      await selectedBranch.save();
    }
  }
});

const User = model("User", userSchema);
module.exports = User;
