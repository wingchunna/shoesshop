const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ColorSchema = new Schema(
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//compile Schema

const Color = mongoose.models.Color || mongoose.model("Color", ColorSchema);

module.exports = Color;
