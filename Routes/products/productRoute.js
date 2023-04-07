const express = require("express");
const {
  addProductCtrl,
  getAllProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} = require("../../Controller/Product/ProductController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const productRoutes = express.Router();

//Products/add
productRoutes.post("/", isLogin, addProductCtrl);

//GET/Products/
productRoutes.get("/", getAllProductCtrl);

//GET/Products/:id
productRoutes.get("/:id", isLogin, getProductByIdCtrl);

//DELETE/Products/
productRoutes.delete("/:id", isLogin, deleteProductCtrl);

//UPDATE/Products/
productRoutes.put("/:id", isLogin, updateProductCtrl);

module.exports = productRoutes;
