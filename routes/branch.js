const express = require("express");
const router = express.Router();

// import model into router
const Branch = require("../models/branch");
const isAdmiHQMiddleware = require("../middleware/auth");

router.get("/", async (request, response) => {
  try {
    response.status(200).send(await Branch.find().sort({ branch: 1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.post("/", isAdmiHQMiddleware, async (request, response) => {
  try {
    const { branch, address, hp, ssm } = request.body;

    // Check if the branch already exists
    const branchExists = await Branch.findOne({ branch });
    if (branchExists) {
      return response.status(400).send({ message: "Branch already exists" });
    }

    // Check if the phone number already exists
    const hpExists = await Branch.findOne({ hp });
    if (hpExists) {
      return response
        .status(400)
        .send({ message: "Phone number already exists" });
    }

    // Check if the SSM number already exists
    const ssmExists = await Branch.findOne({ ssm });
    if (ssmExists) {
      return response
        .status(400)
        .send({ message: "SSM number already exists" });
    }

    // Create a new branch
    const newBranch = new Branch({
      branch,
      address,
      ssm,
      hp,
    });
    await newBranch.save();

    // Respond with the newly created branch
    response.status(200).send(newBranch);
  } catch (error) {
    console.error("Error during branch creation:", error);
    response.status(500).send({ message: "Server error" });
  }
});

router.put("/:id", isAdmiHQMiddleware, async (request, response) => {
  try {
    const branch_id = request.params.id;

    const updatedBranchName = await Branch.findByIdAndUpdate(
      branch_id,
      request.body,
      {
        new: true,
      }
    );
    response.status(200).send(updatedBranchName);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Branch.findOne({ _id: request.params.id }).populate(
      "user"
    );
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdmiHQMiddleware, async (request, response) => {
  try {
    const clientID = request.params.id;
    const client = await Branch.findById(clientID).populate("user");
    await Branch.findByIdAndDelete(clientID);
    response.status(200).send(client);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
