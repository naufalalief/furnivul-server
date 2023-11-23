const Review = require("../../models/review/review");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const reviews = await Review.find({
        _userId: req.payload.id,
      })
        .populate("_userId")
        .populate("_productId");
      sendSuccessResponse(res, 200, "Get all reviews success", reviews);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all reviews", error);
    }
  },

  getDatabyID: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      const review = await Review.findById(id).populate("_userId").populate("_productId");
      sendSuccessResponse(res, 200, "Get review by id success", review);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get review by id", error);
    }
  },

  updateData: async (req, res) => {
    try {
      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      let { rating, comment } = req.body;
      if (!rating || !comment) {
        return sendErrorResponse(
          res,
          400,
          "User, product, rating, comment required",
          new Error("User, product, rating, comment must be not empty")
        );
      }

      const updateReview = await Review.findByIdAndUpdate(
        id,
        { rating, comment },
        { new: true }
      );
      sendSuccessResponse(res, 200, "Update review success", updateReview);
    } catch (error) {
      sendErrorResponse(res, 500, "Error update review", error);
    }
  },

  deleteData: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return sendErrorResponse(
          res,
          400,
          "Review not found",
          new Error("Review not found")
        );
      }
      sendSuccessResponse(res, 200, "Delete review success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete review", error);
    }
  },

  addData: async (req, res) => {
    try {
      let { _productId, rating, comment } = req.body;
      if (!_productId || !rating || !comment) {
        return sendErrorResponse(
          res,
          400,
          "User, product, rating, comment required",
          new Error("User, product, rating, comment must be not empty")
        );
      }

      const newReview = await Review.create({
        _userId: req.payload.id,
        _productId,
        rating,
        comment,
      });
      sendSuccessResponse(res, 200, "Add review success", {
        _id: newReview._id,
        ...newReview._doc,
      });
    } catch (error) {
      sendErrorResponse(res, 500, "Error add review", error);
    }
  },
};
