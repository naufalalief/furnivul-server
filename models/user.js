const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: String,
    province: String,
    district: String,
    subdistrict: String,
    zipcode: String,
    _idRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
