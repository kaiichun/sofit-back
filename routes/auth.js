const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../config");

router.post("/addStaff", async (request, response) => {
  try {
    const name = request.body.name;
    const username = request.body.username;
    const email = request.body.email;
    const password = bcrypt.hashSync(request.body.password, 10);
    const ic = request.body.ic;
    const dob = request.body.dob;
    const gender = request.body.gender;
    const relationship = request.body.relationship;
    const phonenumber = request.body.phonenumber;
    const staffemergencycontactname = request.body.staffemergencycontactname;
    const staffemergencycontact = request.body.staffemergencycontact;
    const address1 = request.body.address1;
    const address2 = request.body.address2;
    const zip = request.body.zip;
    const state = request.body.state;
    const image = request.body.image;
    const bankname = request.body.bankname;
    const bankacc = request.body.bankacc;
    const epf = request.body.epf;
    const socso = request.body.socso;
    const salary = request.body.salary;
    const department = request.body.department;
    const branch = request.body.branch;
    const role = request.body.role;

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return response.status(400).send({ message: "Email already exists" });
    }
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return response.status(400).send({ message: "Username already exists" });
    }
    const user = new User({
      name: name,
      username: username,
      email: email,
      password: password,
      ic: ic,
      dob: dob,
      gender: gender,
      relationship: relationship,
      phonenumber: phonenumber,
      staffemergencycontact: staffemergencycontact,
      staffemergencycontactname: staffemergencycontactname,
      address1: address1,
      address2: address2,
      zip: zip,
      state: state,
      image: image,
      bankname: bankname,
      bankacc: bankacc,
      epf: epf,
      socso: socso,
      salary: salary,
      department: department,
      branch: branch,
      role: role,
    });

    const newUser = await user.save();
    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);
    response.status(200).send({
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      ic: newUser.ic,
      dob: newUser.dob,
      gender: newUser.gender,
      relationship: newUser.relationship,
      phonenumber: newUser.phonenumber,
      staffemergencycontactname: newUser.staffemergencycontactname,
      staffemergencycontact: newUser.staffemergencycontact,
      address1: newUser.address1,
      address2: newUser.address2,
      zip: newUser.zip,
      state: newUser.state,
      image: newUser.image,
      bankname: newUser.bankname,
      bankacc: newUser.bankacc,
      epf: newUser.epf,
      socso: newUser.socso,
      salary: newUser.salary,
      department: newUser.department,
      branch: newUser.branch,
      role: newUser.role,
      active: newUser.active,
      token: token,
    });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.post("/login", async (request, response) => {
  try {
    const username = request.body.username;
    const password = request.body.password;
    const user = await User.findOne({ username: username });
    if (!user) {
      return response
        .status(400)
        .send({ message: "Invalid username or password" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return response
        .status(400)
        .send({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    response.status(200).send({
      _id: user._id,
      name: user.name,
      username: user.username,
      ic: user.ic,
      dob: user.dob,
      gender: user.gender,
      relationship: user.relationship,
      phonenumber: user.phonenumber,
      staffemergencycontactname: user.staffemergencycontactname,
      staffemergencycontact: user.staffemergencycontact,
      address1: user.address1,
      address2: user.address2,
      zip: user.zip,
      state: user.state,
      image: user.image,
      bankname: user.bankname,
      bankacc: user.bankacc,
      epf: user.epf,
      socso: user.socso,
      salary: user.salary,
      department: user.department,
      branch: user.branch,
      role: user.role,
      active: user.active,
      token: token,
    });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
