const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const moragan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const { MONGODB_URL } = require("./config.js");

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(moragan("dev"));
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
const branchRouter = require("./routes/branch.js");
const clientRouter = require("./routes/clients.js");
const appointmentRouter = require("./routes/calendar.js");
const activityRouter = require("./routes/activity.js");
const pmsRouter = require("./routes/pms3.js");
const orderRouter = require("./routes/order.js");
const calendarRouter = require("./routes/calendar.js");
const productRouter = require("./routes/product.js");
const orderPackageRouter = require("./routes/package-order.js");
const packageRouter = require("./routes/package.js");
const clientBmiRouter = require("./routes/clients-bmi.js");
const wageRouter = require("./routes/wage.js");
const commentRouter = require("./routes/comments.js");
const postRouter = require("./routes/post.js");
const uploadImageRouter = require("./routes/image.js");
const uploadClientImageFrontRouter = require("./routes/clients-bmi-image-front.js");
const uploadClientImageBackRouter = require("./routes/clients-bmi-image-back.js");
const uploadClientImageLeftRouter = require("./routes/clients-bmi-image-left.js");
const uploadClientImageRightRouter = require("./routes/clients-bmi-image-right.js");
const uploadClientVideoRouter = require("./routes/clients-bmi-video.js");
const uploadProductImageRouter = require("./routes/product-image.js");
const uploadPostImageRouter = require("./routes/postimage.js");
const uploadClientImageRouter = require("./routes/client-image.js");

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/branch", branchRouter);
app.use("/clients", clientRouter);
app.use("/appointment", appointmentRouter);
app.use("/activity", activityRouter);
app.use("/calendars", calendarRouter);
app.use("/pms", pmsRouter);
app.use("/orders", orderRouter);
app.use("/orderspackage", orderPackageRouter);
app.use("/products", productRouter);
app.use("/packages", packageRouter);
app.use("/clients-composition", clientBmiRouter);
app.use("/wage", wageRouter);
app.use("/uploadimage", uploadImageRouter);
app.use("/uploadclientimagefront", uploadClientImageFrontRouter);
app.use("/uploadclientimageback", uploadClientImageBackRouter);
app.use("/uploadclientimageleft", uploadClientImageLeftRouter);
app.use("/uploadclientimageright", uploadClientImageRightRouter);
app.use("/uploadclientvideo", uploadClientVideoRouter);
app.use("/uploadProductImage", uploadProductImageRouter);
app.use("/uploadPostImage", uploadPostImageRouter);
app.use("/uploadClientImage", uploadClientImageRouter);
app.use("/comments", commentRouter);
app.use("/posts", postRouter);

app.use("/image", express.static("image"));
app.use("/clientimagefront", express.static("clientImageFront"));
app.use("/clientimageback", express.static("clientImageBack"));
app.use("/clientimageleft", express.static("clientImageLeft"));
app.use("/clientimageright", express.static("clientImageRight"));
app.use("/clientvideo", express.static("clientVideo"));
app.use("/productImage", express.static("productImage"));
app.use("/postImage", express.static("postImage"));
app.use("/clientimage", express.static("clientImage"));

app.get("/", (request, response) => {
  response.send("Home");
});

app.listen(port, () => console.log(`Sofit Server started on port ${port}`));
