const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema(
  {
    _discussId: {
      type: Schema.Types.ObjectId,
      ref: "Discuss",
    },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reply: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
