const express = require("express");
const axios = require("axios");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Order = require("../models/order");
const User = require("../models/user");

const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");
const Product = require("../models/product");
const Client = require("../models/client");

router.get("/", authMiddleware, async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }
    response
      .status(200)
      .send(await Order.find(filter).populate("products").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const data = await Order.findOne({ _id: request.params.id });
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: "Order not found" });
  }
});

// let currentMonth = null;

// // Function to generate invoice number
// const generateInvoiceNumber = (orderNumber) => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1;
//   if (month !== currentMonth) {
//     currentMonth = month;
//     orderNumber = 1;
//   }

//   const orderNum = String(orderNumber).padStart(4, "0");
//   return `IV${year}-${month.toString().padStart(2, "0")}-${orderNum}-P`;
// };

// let orderNumber = 1;

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
    ).padStart(4, "0")}-P`;

    // Check if the invoice number already exists in the database
    const existingInvoice = await Order.findOne({ invoiceNo });

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

    const product = await Product.findById(request.body.products);
    if (!product) {
      return response.status(404).json({ message: "Product not found" });
    }

    const {
      staffId,
      staffName,
      totalPrice,
      products,
      name,
      phone,
      status,
      discount,
      address,
      commission,
      discountRate,
      month,
      paid_at,
      clientId,
    } = request.body;

    const newOrder = new Order({
      user: request.user,
      staffId: staffId,
      staffName: staffName,
      products: products,
      totalPrice: totalPrice,
      name: name,
      phone: phone,
      address: address,
      status: status,
      // tax: tax,
      discount: discount,
      discountRate: discountRate,
      commission: product.commission,
      invoiceNo: invoiceNo,
      paid_at: paid_at,
      month: month,
      clientId: clientId,
    });

    if (clientId) {
      newOrder.clientId = clientId;
    }
    const client = await Client.findById(newOrder.clientId);
    // if (!client) {
    //   return response.status(404).json({ message: "Client not found" });
    // }
    client.totalSpend += Number(totalPrice); // Incrementing totalSpend by totalPrice of the order

    if (product.store > 0) {
      product.store--;
    } else {
      return response
        .status(400)
        .json({ message: "Please restore your product" });
    }

    // Save the order and product
    const savedOrder = await Promise.all([
      newOrder.save(),
      product.save(),
      client.save(),
    ]); // Save client too
    response.status(200).send(savedOrder);
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.put("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const order_id = request.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(order_id, request.body, {
      new: true,
    });
    response.status(200).send(updatedOrder);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", isAdminMiddleware, async (request, response) => {
  try {
    const order_id = request.params.id;

    const deleteOrder = await Order.findByIdAndDelete(order_id);
    response.status(200).send(deleteOrder);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
