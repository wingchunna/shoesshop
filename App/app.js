const express = require("express");
const { appError, notFound } = require("../Middlewares/appError");
const app = express();
require("dotenv").config();
require("../Config/dbConnect");
const userRoutes = require("../Routes/users/userRoute");
const productRoutes = require("../Routes/products/productRoute");
app.use(express.json());

//Routes
//User Routes
app.use("/api/v1/users", userRoutes);
//Product Routes
app.use("/api/v1/products", productRoutes);

app.use(notFound);
//error middlewares

module.exports = app;
