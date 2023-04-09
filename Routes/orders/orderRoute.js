const express = require("express");
const {
  addOrderCtrl,
  getAllOrderCtrl,
  getOrderByIdCtrl,
  updateOrderCtrl,
  deleteOrderCtrl,
} = require("../../Controller/Order/OrderController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const orderRoutes = express.Router();

//Orders/add
orderRoutes.post("/", isLogin, addOrderCtrl);

//GET/Orders/
orderRoutes.get("/", getAllOrderCtrl);

//GET/Orders/:id
orderRoutes.get("/:id", getOrderByIdCtrl);

//DELETE/Orders/
orderRoutes.delete("/:id", isLogin, deleteOrderCtrl);

//UPDATE/Orders/
orderRoutes.put("/:id", isLogin, updateOrderCtrl);

module.exports = orderRoutes;
