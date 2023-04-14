const express = require("express");
const {
  addColorCtrl,
  getAllColorCtrl,
  getColorByIdCtrl,
  updateColorCtrl,
  deleteColorCtrl,
} = require("../../Controller/Color/colorController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const colorRoutes = express.Router();

//Colors/add
colorRoutes.post("/", isLogin, addColorCtrl);

//GET/Colors/
colorRoutes.get("/", getAllColorCtrl);

//GET/Colors/:id
colorRoutes.get("/:id", getColorByIdCtrl);

//DELETE/Colors/
colorRoutes.delete("/:id", isLogin, deleteColorCtrl);

//UPDATE/Colors/
colorRoutes.put("/:id", isLogin, updateColorCtrl);

module.exports = colorRoutes;
