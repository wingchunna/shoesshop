const express = require("express");
const { appError, notFound } = require("../Middlewares/appError");
const app = express();
require("dotenv").config();
require("../Config/dbConnect");
const userRoutes = require("../Routes/users/userRoute");
const productRoutes = require("../Routes/products/productRoute");
const categoryRoutes = require("../Routes/categories/categoryRoute");
const brandRoutes = require("../Routes/brands/brandRoute");
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

app.use(notFound);
//error middlewares

module.exports = app;
