const express = require("express");
const {
  addCouponCtrl,
  getAllCouponCtrl,
  getCouponByIdCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
  getCouponByNameCtrl,
} = require("../../Controller/Coupon/couponController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const couponRoutes = express.Router();

//Coupons/add
couponRoutes.post("/", isLogin, isAdmin, addCouponCtrl);

//GET/Coupons/
couponRoutes.get("/", getAllCouponCtrl);

//GET/Coupons/:id
couponRoutes.get("/:id", getCouponByIdCtrl);

//GET/Coupons/name
couponRoutes.get("/getcoupon/:code", getCouponByNameCtrl);

//DELETE/Coupons/
couponRoutes.delete("/:id", isLogin, isAdmin, deleteCouponCtrl);

//UPDATE/Coupons/
couponRoutes.put("/:id", isLogin, isAdmin, updateCouponCtrl);

module.exports = couponRoutes;
