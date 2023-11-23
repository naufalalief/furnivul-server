const mongoose = require("mongoose");
const { Schema } = mongoose;

const voucherSchema = new Schema(
  {
    name:
    {
      type: String,
      required: true,
    },
    discount:
    {
      type: Number,
      required: true,
    },
    description:
    {
      type: String,
      required: true,
    },
    code:
    {
      type: String,
      required: true,
    },
    start_date:
    {
      type: Date,
      required: true,
    },
    end_date:
    {
      type: Date,
      required: true,
    },
    isActive:
    {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;