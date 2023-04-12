const express = require("express");
const {
  userRegisterCtrl,
  userLoginCtrl,
  getAllUserCtrl,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
  getUserProfileCtrl,
  updateShippingAddressCtrl,
} = require("../../Controller/User/userController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const userRoutes = express.Router();

//users/register
userRoutes.post("/register", userRegisterCtrl);

//users/login
userRoutes.post("/login", userLoginCtrl);

//GET/users/
userRoutes.get("/", isLogin, getAllUserCtrl);

//GET/users/:id
userRoutes.get("/:id", isLogin, getUserByIdCtrl);

//DELETE/users/
userRoutes.delete("/:id", isLogin, deleteUserCtrl);

//UPDATE/users/
userRoutes.put("/:id", isLogin, updateUserCtrl);

//GET/users/profile
userRoutes.get("/profile", isLogin, getUserProfileCtrl);

//UPDATE/shipping Address/
userRoutes.put("/update/shippingAddress", isLogin, updateShippingAddressCtrl);

module.exports = userRoutes;
