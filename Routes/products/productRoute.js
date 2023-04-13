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
const storage = require("../../Config/upload-product-images");
const multer = require("multer");
const upload = multer({ storage });
//Products/add
productRoutes.post(
  "/",
  isLogin,
  isAdmin,
  upload.array("images"),
  addProductCtrl
);

//GET/Products/
productRoutes.get("/", getAllProductCtrl);

//GET/Products/:id
productRoutes.get("/:id", getProductByIdCtrl);

//DELETE/Products/
productRoutes.delete("/:id", isLogin, isAdmin, deleteProductCtrl);

//UPDATE/Products/
productRoutes.put(
  "/:id",
  isLogin,
  isAdmin,
  isAdmin,
  upload.array("images"),
  updateProductCtrl
);

//UPDATE Photo
// productRoutes.post(
//   "/product-photo-upload",
//   isLogin,
//   upload.array("files"),
//   uploadPhotoProductCtrl
// );

module.exports = productRoutes;
