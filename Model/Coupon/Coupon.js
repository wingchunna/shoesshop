const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//generate random Coupon number

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },
    discount: {
      type: Number,
      require: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
//coupon is expired

CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

CouponSchema.virtual("daysLeft").get(function () {
  const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 3600 * 24));

  return daysLeft;
});
//compile Schema

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

module.exports = Coupon;
