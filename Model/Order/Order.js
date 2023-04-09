const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//generate random order number
const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 100000);
const OrderSchema = new Schema(
  {
    orderItems: [
      {
        type: Object,
        require: true,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    shipingAdress: {
      type: Object,
      require: true,
    },
    orderNumber: {
      type: String,
      default: randomText + randomNumber,
    },
    paymentStatus: {
      type: String,
      default: "Not paid",
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//compile Schema

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
