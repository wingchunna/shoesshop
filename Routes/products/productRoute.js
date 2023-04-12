const express = require("express");
const {
  addProductCtrl,
  getAllProductCtrl,
  getProductByIdCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  uploadPhotoProductCtrl,
} = require("../../Controller/Product/ProductController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const productRoutes = express.Router();
const storage = require("../../Config/cloudinary");
const multer = require("multer");
const upload = multer({ storage });
//Products/add
productRoutes.post("/", isLogin, addProductCtrl);

//GET/Products/
productRoutes.get("/", getAllProductCtrl);

//GET/Products/:id
productRoutes.get("/:id", getProductByIdCtrl);

//DELETE/Products/
productRoutes.delete("/:id", isLogin, deleteProductCtrl);

//UPDATE/Products/
productRoutes.put("/:id", isLogin, updateProductCtrl);

//UPDATE Photo
userRouter.post(
  "/product-photo-upload",
  isLogin,
  upload.array("files"),
  uploadPhotoProductCtrl
);

module.exports = productRoutes;
