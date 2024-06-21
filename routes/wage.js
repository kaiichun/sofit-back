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

router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const data = await Wage.findOne({ _id: request.params.id });
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

let currentMonth = null;

// Function to generate invoice number
const generatePackagePayslipNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month !== currentMonth) {
    currentMonth = month;
    orderPackageNumber = 1;
  }

  let payslipNo;
  let isUnique = false;
  let attempts = 0;

  // Loop until a unique invoice number is generated
  while (!isUnique && attempts < MAX_ATTEMPTS) {
    payslipNo = `PS${year}-${month.toString().padStart(2, "0")}-${String(
      orderPackageNumber
    ).padStart(4, "0")}`;

    // Check if the invoice number already exists in the database
    const existingInvoice = await Wage.findOne({ payslipNo });

    if (!existingInvoice) {
      // Invoice number is unique
      isUnique = true;
    } else {
      // Increment the order package number and attempt again
      orderPackageNumber++;
      attempts++;
    }
  }

  if (!isUnique) {
    // Handle the case where a unique invoice number could not be generated
    throw new Error("Unable to generate a unique invoice number.");
  }

  return payslipNo;
};

let orderPackageNumber = 1;
const MAX_ATTEMPTS = 10; // Maximum number of attempts to generate a unique invoice number

router.post("/", isAdminMiddleware, async (request, response) => {
  try {
    const payslipNo = await generatePackagePayslipNumber();

    const newStaffWage = new Wage({
      user: request.user,
      payslipNo: payslipNo,
      ic: request.body.ic,
      bankacc: request.body.bankacc,
      bankname: request.body.bankname,
      socsoNo: request.body.socsoNo,
      epfNo: request.body.epfNo,
      eisNo: request.body.eisNo,
      staffId: request.body.staffId,
      pms: request.body.pms,
      name: request.body.name,
      totalpms: request.body.totalpms,
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
      commission: request.body.commission,
      employerEpf: request.body.employerEpf,
      employerSocso: request.body.employerSocso,
      employerEis: request.body.employerEis,
      totalIncome: request.body.totalIncome,
      totalDeduction: request.body.totalDeduction,
      overtime: request.body.overtime,
      nettPay: request.body.nettPay,
      branch: request.body.branch,
    });

    await newStaffWage.save();

    response.status(200).send(newStaffWage);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.get("/", authMiddleware, async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }
    response.status(200).send(await Wage.find(filter).sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

module.exports = router;
