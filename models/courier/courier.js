const mongoose = require("mongoose");
const { Schema } = mongoose;

const courierSchema = new Schema(
  {
    courier: {
      type: String,
      required: true,
    },
    _idCourierService: [{
      type: Schema.Types.ObjectId,
      ref: "Courier Service",
    }],
  },
  { timestamps: true }
);

const Courier = mongoose.model("Courier", courierSchema);

module.exports = Courier;
