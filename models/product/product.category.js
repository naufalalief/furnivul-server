const mongoose = require("mongoose");
const { Schema } = mongoose;

const productCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model("Product Category", productCategorySchema);

module.exports = ProductCategory;
