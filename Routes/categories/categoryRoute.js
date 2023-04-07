const express = require("express");
const {
  addCategoryCtrl,
  getAllCategoryCtrl,
  getCategoryByIdCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../Controller/Category/categoryController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const categoryRoutes = express.Router();

//category/add
categoryRoutes.post("/", isLogin, addCategoryCtrl);

//GET/category/
categoryRoutes.get("/", getAllCategoryCtrl);

//GET/category/:id
categoryRoutes.get("/:id", getCategoryByIdCtrl);

//DELETE/category/
categoryRoutes.delete("/:id", isLogin, deleteCategoryCtrl);

//UPDATE/category/
categoryRoutes.put("/:id", isLogin, updateCategoryCtrl);

module.exports = categoryRoutes;
