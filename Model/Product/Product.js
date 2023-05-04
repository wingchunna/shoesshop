const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    sizes: {
      type: [String],
      require: true,
      enum: [
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
      ],
    },

    colors: {
      type: [String],
      require: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    images: [
      {
        type: String,
        default: "https://via.placeholder.com/150",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      require: true,
    },
    totalQuantity: {
      type: Number,
      require: true,
    },
    totalSold: {
      type: Number,
      default: 0,
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// set virtual

// cal total product left
ProductSchema.virtual("totalItemLeft").get(function () {
  const product = this;
  return product?.totalQuantity - product?.totalSold;
});

// total reviews
ProductSchema.virtual("totalReviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});
//total rating
ProductSchema.virtual("totalRating").get(function () {
  const product = this;
  let totalRating = 0;
  product.reviews?.forEach((review) => {
    totalRating += review.rating;
  });
  //calc avarage rating
  const avarageRating = totalRating / product.reviews.length;

  return avarageRating;
});
//compile Schema

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
