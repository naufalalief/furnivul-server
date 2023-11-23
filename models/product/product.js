const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    _categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Product Category",
    },
    product_description: {
      type: String,
      required: true,
    },
    _typeId: {
      type: Schema.Types.ObjectId,
      ref: "Product Type",
    },
    product_material: {
      type: String,
      required: true,
    },
    product_rate: {
      type: Number,
      required: true,
    },
    product_sold: {
      type: Number,
      required: true,
    },
    product_review: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
