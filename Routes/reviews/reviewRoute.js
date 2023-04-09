const express = require("express");
const {
  addReviewCtrl,
  getAllReviewCtrl,
  getReviewByIdCtrl,
  updateReviewCtrl,
  deleteReviewCtrl,
} = require("../../Controller/Review/ReviewController");
const isLogin = require("../../Middlewares/isLogin");
const isAdmin = require("../../Middlewares/isAdmin");
const reviewRoutes = express.Router();

//Reviews/add
reviewRoutes.post("/:productId", isLogin, addReviewCtrl);

//GET/Reviews/
reviewRoutes.get("/", getAllReviewCtrl);

//GET/Reviews/:id
reviewRoutes.get("/:id", getReviewByIdCtrl);

//DELETE/Reviews/
reviewRoutes.delete("/:id", isLogin, deleteReviewCtrl);

//UPDATE/Reviews/
reviewRoutes.put("/:id", isLogin, updateReviewCtrl);

module.exports = reviewRoutes;
