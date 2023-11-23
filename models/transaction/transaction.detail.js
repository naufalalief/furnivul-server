const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionDetailSchema = new Schema(
  {
    _transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    _productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    _courierId: {
      type: Schema.Types.ObjectId,
      ref: "Courier",
    },
    _courierServiceId: {
      type: Schema.Types.ObjectId,
      ref: "Courier Service",
    },
    _voucherId: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
    },
    qty: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TransactionDetail = mongoose.model(
  "Transaction Detail",
  transactionDetailSchema
);

module.exports = TransactionDetail;