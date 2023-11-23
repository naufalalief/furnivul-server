const Review = require("../../models/review/review");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Product = require("../../models/product/product");
const TransactionDetail = require("../../models/transaction/transaction.detail");
const Transaction = require("../../models/transaction/transaction");
const Role = require("../../models/role/role");

module.exports = {
  getReviewData: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You are not admin")
        );
      }

      const reviews = await Review.find()
        .populate("_userId")
        .populate("_productId");
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (reviews.length === 0) {
          return sendSuccessResponse(res, 200, "Success", "Review is empty");
        }
        sendSuccessResponse(res, 200, "Success", reviews);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < reviews.length) {
          result.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit: limit,
          };
        }
        result.reviews = reviews.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all reviews page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },

  getAllData: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("_userId")
        .populate("_productId");
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (reviews.length === 0) {
          return sendSuccessResponse(res, 200, "Success", "Review is empty");
        }
        sendSuccessResponse(res, 200, "Success", reviews);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < reviews.length) {
          result.next = {
            page: page + 1,
            limit: limit,
          };
        }

        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit: limit,
          };
        }
        result.reviews = reviews.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all reviews page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },

  getDatabyID: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      const review = await Review.findById(id)
        .populate("_userId")
        .populate("_productId");

      if (!review) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Review not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", review);
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },

  updateData: async (req, res) => {
    try {
      let { id } = req.params;
      const userId = req.payload.id;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      let { rating, comment } = req.body;
      if (!rating || !comment) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("User, product, rating, comment must be not empty")
        );
      }
      const review = await Review.findById(id);
      if (!review) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Review not found")
        );
      }

      if (userId !== review._userId.toString()) {
        return sendErrorResponse(
          res,
          403,
          "Unauthorized",
          new Error("You are not authorized to update this review.")
        );
      }

      const updateReview = await Review.findByIdAndUpdate(
        id,
        { rating, comment },
        { new: true }
      );

      if (!updateReview) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Review not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", updateReview);
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },

  deleteData: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You are not admin")
        );
      }
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Review not found")
        );
      }
      sendSuccessResponse(res, 200, "Success");
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },

  addData: async (req, res) => {
    try {
      let { _productId, rating, comment } = req.body;
      if (!_productId || !rating || !comment) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("User, product, rating, comment must be not empty")
        );
      }
      const findProductId = await Product.findById(_productId);
      if (!findProductId) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Product not found")
        );
      }

      const transaction = await Transaction.findOne({
        _userId: req.payload.id,
      });
      if (!transaction) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("User has not bought the product")
        );
      }

      const transactionDetail = await TransactionDetail.findOne({
        _transactionId: transaction._id,
        _productId,
      });
      if (!transactionDetail) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("User has not bought the product")
        );
      }

      const newReview = await Review.create({
        _userId: req.payload.id,
        _productId,
        rating,
        comment,
      });

      sendSuccessResponse(res, 200, "Success", newReview);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};
