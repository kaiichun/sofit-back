const express = require("express");
const axios = require("axios");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Order = require("../models/order");
const User = require("../models/user");

const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");
const Product = require("../models/product");
const OrderPackage = require("../models/package-order");
const Package = require("../models/package");
const Client = require("../models/client");

router.get("/", authMiddleware, async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.packages = { $regex: keyword, $options: "i" };
    }
    response
      .status(200)
      .send(
        await OrderPackage.find(filter).populate("packages").sort({ _id: -1 })
      );
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const data = await OrderPackage.findOne({ _id: request.params.id });
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

// let currentMonth = null;

// // Function to generate invoice number
// const generatePackageInvoiceNumber = async () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   if (month !== currentMonth) {
//     currentMonth = month;
//     orderPackageNumber = 1;
//   }

//   let invoiceNo;
//   let isUnique = false;
//   let attempts = 0;

//   // Loop until a unique invoice number is generated
//   while (!isUnique && attempts < MAX_ATTEMPTS) {
//     invoiceNo = `IV${year}-${month.toString().padStart(2, "0")}-${String(
//       orderPackageNumber
//     ).padStart(4, "0")}-T`;

//     // Check if the invoice number already exists in the database
//     const existingInvoice = await OrderPackage.findOne({ invoiceNo });

//     if (!existingInvoice) {
//       // Invoice number is unique
//       isUnique = true;
//     } else {
//       // Increment the order package number and attempt again
//       orderPackageNumber++;
//       attempts++;
//     }
//   }

//   if (!isUnique) {
//     // Handle the case where a unique invoice number could not be generated
//     throw new Error("Unable to generate a unique invoice number.");
//   }

//   return invoiceNo;
// };

// let orderPackageNumber = 1;
// const MAX_ATTEMPTS = 10; // Maximum number of attempts to generate a unique invoice number

// router.post("/", authMiddleware, async (request, response) => {
//   try {
//     const invoiceNo = await generatePackageInvoiceNumber();

//     // Calculate expiration date based on the validity period of the selected package
//     const expirationDate = new Date();
//     expirationDate.setMonth(expirationDate.getMonth() + 3);

//     const newOrderPackage = new OrderPackage({
//       user: request.user,
//       packages: request.body.packages,
//       tax: request.body.tax,
//       totalPrice: request.body.totalPrice,
//       clientId: request.body.clientId,
//       invoiceNo: invoiceNo,
//       tax: request.body.tax,
//       paid_at: request.body.paid_at,
//     });

//     // If a client ID is provided, assign it to the order package
//     if (request.body.clientId) {
//       newOrderPackage.clientId = request.body.clientId;
//     }

//     const packages = await Package.findById(request.body.packages);
//     if (!packages) {
//       return response.status(404).json({ message: "packages not found" });
//     }

//     // Fetch the client from the database based on the client ID
//     const client = await Client.findById(request.body.clientId);
//     if (!client) {
//       return response.status(404).json({ message: "Client not found" });
//     }

//     // Update the client's session count
//     client.sessions += packages.sessions;

//     // Set the client's package validity period
//     client.packageValidityPeriod = expirationDate;

//     // Check if the current date is past the expiration date
//     const currentDate = new Date();
//     if (currentDate > expirationDate) {
//       // If past the expiration date, set sessions to 0
//       client.sessions = 0;
//     }

//     // Save the updated client object
//     await client.save();

//     // Save the order package
//     const savedOrderPackage = await newOrderPackage.save();

//     response.status(200).send(savedOrderPackage);
//   } catch (error) {
//     response.status(400).send({ message: error.message });
//   }
// });

let currentMonth = null;

// Function to generate invoice number
const generatePackageInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month !== currentMonth) {
    currentMonth = month;
    orderPackageNumber = 1;
  }

  let invoiceNo;
  let isUnique = false;
  let attempts = 0;

  // Loop until a unique invoice number is generated
  while (!isUnique && attempts < MAX_ATTEMPTS) {
    invoiceNo = `IV${year}-${month.toString().padStart(2, "0")}-${String(
      orderPackageNumber
    ).padStart(4, "0")}-T`;

    // Check if the invoice number already exists in the database
    const existingInvoice = await OrderPackage.findOne({ invoiceNo });

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

  return invoiceNo;
};

let orderPackageNumber = 1;
const MAX_ATTEMPTS = 10; // Maximum number of attempts to generate a unique invoice number

router.post("/", authMiddleware, async (request, response) => {
  try {
    const invoiceNo = await generatePackageInvoiceNumber();

    const {
      packages,
      clientId,
      staffId,
      staffName,
      tax,
      totalPrice,
      paymentMethod,
      payby,
      installmentMonth,
      installmentAmount,
      outstanding,
      discount,
      discountRate,
      year,
      month,
      day,
      paid_at,
    } = request.body;

    const package = await Package.findById(packages);
    if (!package) {
      return response.status(404).json({ message: "Package not found" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return response.status(404).json({ message: "Client not found" });
    }

    const expirationDate = client.packageValidityPeriod
      ? new Date(client.packageValidityPeriod)
      : new Date();
    expirationDate.setMonth(expirationDate.getMonth() + package.valiMonth);

    if (
      client.packageValidityPeriod &&
      new Date(client.packageValidityPeriod).getTime() === new Date().getTime()
    ) {
      client.sessions = 0;
      client.packageValidityPeriod = null;
    } else {
      client.sessions += package.sessions;
      client.packageValidityPeriod = expirationDate;
    }

    await client.save();

    const newOrderPackage = new OrderPackage({
      user: request.user,
      staffId: staffId,
      staffName: staffName,
      packages: packages,
      tax: tax,
      totalPrice: totalPrice,
      clientId: clientId,
      invoiceNo: invoiceNo,
      paymentMethod: paymentMethod,
      payby: payby,
      installmentMonth: installmentMonth,
      installmentAmount: installmentAmount,
      outstanding: outstanding,
      discount: discount,
      discountRate: discountRate,
      year: year,
      month: month,
      day: day,
      paid_at: paid_at,
    });

    const savedOrderPackage = await newOrderPackage.save();
    response.status(200).send(savedOrderPackage);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.put("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const order_id = request.params.id;

    const updatedOrder = await OrderPackage.findByIdAndUpdate(
      order_id,
      request.body,
      {
        new: true,
      }
    );
    response.status(200).send(updatedOrder);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const order_id = request.params.id;

    const deleteOrder = await OrderPackage.findByIdAndDelete(order_id);
    response.status(200).send(deleteOrder);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
