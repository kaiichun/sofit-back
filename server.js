const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { MONGODB_URL } = require("./config.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 2019;

const corsHandler = cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: true,
});

app.use(corsHandler);

mongoose
  .connect(MONGODB_URL + "sofitDB")
  .then(() => console.log("Sofit MongoDB is Connected... "))
  .catch((error) => console.log(error));

const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/users.js");
const clientRouter = require("./routes/clients.js");
const uploadImageRouter = require("./routes/image.js");

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/clients", clientRouter);
app.use("/uploadimage", uploadImageRouter);
app.use("/image", express.static("image"));

app.get("/", (request, response) => {
  response.send("Home");
});

app.listen(port, () => console.log(`Youtube Server started on port ${port}`));
