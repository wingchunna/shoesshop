const express = require("express");
const {
  addBrandCtrl,
  getAllBrandCtrl,
  getBrandByIdCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
} = require("../../Controller/Brand/BrandController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const brandRoutes = express.Router();

//Brand/add
brandRoutes.post("/", isLogin, addBrandCtrl);

//GET/Brand/
brandRoutes.get("/", getAllBrandCtrl);

//GET/Brand/:id
brandRoutes.get("/:id", getBrandByIdCtrl);

//DELETE/Brand/
brandRoutes.delete("/:id", isLogin, deleteBrandCtrl);

//UPDATE/Brand/
brandRoutes.put("/:id", isLogin, updateBrandCtrl);

module.exports = brandRoutes;
