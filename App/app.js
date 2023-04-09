const express = require("express");
const { appError, notFound } = require("../Middlewares/appError");
const app = express();
require("dotenv").config();
require("../Config/dbConnect");
const userRoutes = require("../Routes/users/userRoute");
const productRoutes = require("../Routes/products/productRoute");
const categoryRoutes = require("../Routes/categories/categoryRoute");
const brandRoutes = require("../Routes/brands/brandRoute");
const colorRoutes = require("../Routes/colors/colorRoute");
const reviewRoutes = require("../Routes/reviews/reviewRoute");
const orderRoutes = require("../Routes/orders/orderRoute");
app.use(express.json());

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

app.use(notFound);
//error middlewares

module.exports = app;
