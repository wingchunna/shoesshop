const express = require("express");
const {
  addOrderCtrl,
  getAllOrderCtrl,
  getOrderByIdCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
  createPaymentUrlCtrl,
  querydrCtrl,
  refundCtrl,
  getVNPayIpnCtrl,
  getVNPayReturnCtrl,
  getOrderStatsCtrl,
  getOrderByUserCtrl,
} = require("../../Controller/Order/orderController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const orderRoutes = express.Router();

//Orders/add
orderRoutes.post("/", isLogin, addOrderCtrl);

//GET/Orders/
orderRoutes.get("/", getAllOrderCtrl);

//GET/Orders/:id
orderRoutes.get("/:id", getOrderByIdCtrl);

orderRoutes.get("/user/:userId", isLogin, getOrderByUserCtrl);

//DELETE/Orders/
orderRoutes.delete("/:id", isLogin, deleteOrderCtrl);

//UPDATE/Orders/ only admin
orderRoutes.put("/:id", isLogin, isAdmin, updateOrderCtrl);

//POST/Create Payment Url/
orderRoutes.post("/payments/create_payment_url", isLogin, createPaymentUrlCtrl);

//POST/Create Payment Url/
orderRoutes.post("/payments/querydr", isLogin, querydrCtrl);

//POST/refund/
orderRoutes.post("/payments/refund", isLogin, refundCtrl);

//GET/Vnpay Ipn/
orderRoutes.get("/payments/vnpay_ipn", getVNPayIpnCtrl);

//GET/Vnpay return/
orderRoutes.get("/payments/vnpay_return", getVNPayReturnCtrl);

//GET/Vnpay return/
orderRoutes.get("/sales/stats", isLogin, getOrderStatsCtrl);

module.exports = orderRoutes;
