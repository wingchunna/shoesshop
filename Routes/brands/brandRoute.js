const express = require("express");
const {
  addBrandCtrl,
  getAllBrandCtrl,
  getBrandByIdCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
} = require("../../Controller/Brand/brandController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const storage = require("../../Config/upload-brand-images");
const multer = require("multer");
const upload = multer({ storage });
const brandRoutes = express.Router();

//Brand/add
brandRoutes.post("/", isLogin, isAdmin, upload.single("image"), addBrandCtrl);

//GET/Brand/
brandRoutes.get("/", getAllBrandCtrl);

//GET/Brand/:id
brandRoutes.get("/:id", getBrandByIdCtrl);

//DELETE/Brand/
brandRoutes.delete("/:id", isLogin, isAdmin, deleteBrandCtrl);

//UPDATE/Brand/
brandRoutes.put(
  "/:id",
  isLogin,
  isAdmin,
  upload.single("image"),
  updateBrandCtrl
);

module.exports = brandRoutes;
