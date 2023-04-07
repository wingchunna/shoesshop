const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    images: {
      type: String,
      require: true,
      default: "https://picsum.photos/200/300",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//compile Schema

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

module.exports = Brand;
