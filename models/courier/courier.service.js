const mongoose = require("mongoose");
const { Schema } = mongoose;

const courierServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  etd: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const CourierService = mongoose.model("Courier Service", courierServiceSchema);

module.exports = CourierService;
