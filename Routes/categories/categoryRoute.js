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
const storage = require("../../Config/upload-category-images");
const multer = require("multer");
const upload = multer({ storage });
const categoryRoutes = express.Router();

//category/add
categoryRoutes.post(
  "/",
  isLogin,
  isAdmin,
  upload.single("image"),
  addCategoryCtrl
);

//GET/category/
categoryRoutes.get("/", getAllCategoryCtrl);

//GET/category/:id
categoryRoutes.get("/:id", getCategoryByIdCtrl);

//DELETE/category/
categoryRoutes.delete("/:id", isLogin, isAdmin, deleteCategoryCtrl);

//UPDATE/category/
categoryRoutes.put(
  "/:id",
  isLogin,
  isAdmin,
  upload.single("image"),
  updateCategoryCtrl
);

module.exports = categoryRoutes;
