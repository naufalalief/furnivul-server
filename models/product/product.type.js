const mongoose = require("mongoose");
const { Schema } = mongoose;

const productTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductType = mongoose.model("Product Type", productTypeSchema);

module.exports = ProductType;
