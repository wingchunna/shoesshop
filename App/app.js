const express = require("express");
const { appError, notFound } = require("../Middlewares/appError");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

require("dotenv").config();
require("../Config/dbConnect");
const userRoutes = require("../Routes/users/userRoute");
const productRoutes = require("../Routes/products/productRoute");
const categoryRoutes = require("../Routes/categories/categoryRoute");
const brandRoutes = require("../Routes/brands/brandRoute");
const colorRoutes = require("../Routes/colors/colorRoute");
const reviewRoutes = require("../Routes/reviews/reviewRoute");
const orderRoutes = require("../Routes/orders/orderRoute");
const couponRoutes = require("../Routes/coupons/couponRoute");
app.use(express.json());

app.use(cookieParser());
app.set("trust proxy", 1);
// config session
app.use(
  session({
    name: "cookye",
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {
      sameSite: "strict",
      secure: false,
      saveUninitialized: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 * 4 * 6,
      resave: false,
    },

    // store: new RedisStore(),
  })
);
app.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors());

//Routes
//User Routes

app.use("/api/v1/users", userRoutes);
//Product Routes
app.use("/api/v1/products", productRoutes);
//Category Routes
app.use("/api/v1/categories", categoryRoutes);
//Brand Routes
app.use("/api/v1/brands", brandRoutes);
//Color Routes
app.use("/api/v1/colors", colorRoutes);
//Review Routes
app.use("/api/v1/reviews", reviewRoutes);
//Order Routes
app.use("/api/v1/orders", orderRoutes);
//Coupon Routes
app.use("/api/v1/coupons", couponRoutes);

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(404);
});

app.use(notFound);
//error middlewares

module.exports = app;
