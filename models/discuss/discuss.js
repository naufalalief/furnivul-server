const mongoose = require("mongoose");
const { Schema } = mongoose;

const discussSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    _productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Discuss = mongoose.model("Discuss", discussSchema);

module.exports = Discuss;
