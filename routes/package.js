const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");
const Package = require("../models/package");

router.get("/", async (request, response) => {
  try {
    const { category } = request.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    response.status(200).send(await Package.find(filter).sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: "Product not found" });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Package.findOne({ _id: request.params.id });
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: "Product ID not found" });
  }
});

router.post("/", isAdminMiddleware, async (request, response) => {
  try {
    const newPackage = new Package({
      sofitpackage: request.body.sofitpackage,
      price: request.body.price,
      sessions: request.body.sessions,
      category: request.body.category,
      valiMonth: request.body.valiMonth,
    });
    await newPackage.save();
    response.status(200).send(newPackage);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const package_id = request.params.id;

    const updatedPackage = await Package.findByIdAndUpdate(
      package_id,
      request.body,
      {
        new: true,
      }
    );
    response.status(200).send(updatedPackage);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const package_id = request.params.id;
    const deletePackage = await Package.findByIdAndDelete(package_id);
    response.status(200).send(deletePackage);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
