const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: [true, "review must belong to a product"],
    },
    message: {
      type: String,
      require: [true, "Please add a message"],
    },
    rating: {
      type: Number,
      require: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//compile Schema

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

module.exports = Review;
