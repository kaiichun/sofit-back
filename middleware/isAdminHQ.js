const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config");

const authMiddleware = async (req, res, next) => {
  try {
    // Check if the Authorization header exists
    if (!req.headers.authorization) {
      console.log("No authorization header");
      return res.status(401).send({ message: "No token provided" });
    }

    // Extract the token
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log("Token received:", token);

    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find user by _id
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      console.log("No user found with id:", decoded._id);
      return res.status(404).send({ message: "No user found" });
    }
    console.log("User found:", user);

    if (user.role !== "Admin HQ") {
      console.log("User is not an admin:", user.role);
      return res.status(403).send({ message: "You're not an admin" });
    }

    // Attach the user to the request and proceed
    req.user = user;

    console.log("User authorized:", user);
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return res.status(401).send({ message: "Not Authorized" });
  }
};

module.exports = authMiddleware;
