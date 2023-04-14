const express = require("express");
const userRoutes = express.Router();

const {
  userRegisterCtrl,
  userLoginCtrl,
  getAllUserCtrl,
  getUserByIdCtrl,
  updateUserCtrl,
  deleteUserCtrl,
  getUserProfileCtrl,
  updateShippingAddressCtrl,
  uploadPhotoProfileCtrl,
  updatePasswordUserCtrl,
  resetPasswordUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  adminDashboardCtrl,
  reqResetPasswordCtrl,
  userLogoutCtrl,
} = require("../../Controller/User/userController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const storage = require("../../Config/upload-profile-images");
const multer = require("multer");
const upload = multer({ storage });

//POST/users/register
userRoutes.post("/register", userRegisterCtrl);

//POST/users/login
userRoutes.post("/login", userLoginCtrl);

//GET/users/logout
userRoutes.get("/logout", isLogin, userLogoutCtrl);

//GET/users/ get all user
userRoutes.get("/", isLogin, getAllUserCtrl);

//GET/users/:id
userRoutes.get("/:id", isLogin, getUserByIdCtrl);

//DELETE/users/ Xóa tài khoản
userRoutes.delete("/", isLogin, deleteUserCtrl);

//UPDATE/users/
userRoutes.put("/:id", isLogin, updateUserCtrl);

//GET/users/profile
userRoutes.get("/profile/get-profile", isLogin, getUserProfileCtrl);

//UPDATE/shipping Address/
userRoutes.put("/update/shipping-address", isLogin, updateShippingAddressCtrl);

//UPDATE Photo
userRoutes.post(
  "/update/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  uploadPhotoProfileCtrl
);

//PUT /User change password
userRoutes.put("/update/password", isLogin, updatePasswordUserCtrl);

//GET /User reset password
userRoutes.get("/password/reset-request", reqResetPasswordCtrl);

//POST /User reset password
userRoutes.post("/password/reset", resetPasswordUserCtrl);

//PUT /Admin block user
userRoutes.put("/block-user/:id", isLogin, isAdmin, blockUserCtrl);

//PUT /Admin unblock user
userRoutes.put("/unblock-user/:id", isLogin, isAdmin, unblockUserCtrl);

//GET /Admin unblock user
userRoutes.get("/admins/dashboard", isLogin, isAdmin, adminDashboardCtrl);

module.exports = userRoutes;
