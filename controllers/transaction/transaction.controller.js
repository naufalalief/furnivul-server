const Transaction = require("../../models/transaction/transaction");
const TransactionDetail = require("../../models/transaction/transaction.detail");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

module.exports = {
  getAllDataTransaction: async (req, res) => {
    try {
      const role = req.payload.role;
      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden access",
          new Error("You are logged in as user")
        );
      }

      const transactions = await Transaction.find().populate("_userId");

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (transactions.length === 0) {
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Transaction is empty"
          );
        }

        sendSuccessResponse(res, 200, "Success", transactions);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < transactions.length) {
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

        result.transactions = transactions.slice(startIndex, endIndex);
        sendSuccessResponse(
          res,
          200,
          "Get all transactions page " + page,
          result
        );
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  getAllData: async (req, res) => {
    try {
      const userId = req.payload.id;

      // Pagination
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("You must login first to access this page(s).")
        );
      }

      const transactions = await Transaction.find({ _userId: userId }).populate(
        "_userId"
      );

      if (!transactions) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transactions not found")
        );
      }

      if (!page || !limit) {
        if (transactions.length === 0) {
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Transaction is empty"
          );
        }

        return sendSuccessResponse(res, 200, "Success", transactions);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < transactions.length) {
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
        result.transactions = transactions.slice(startIndex, endIndex);

        return sendSuccessResponse(
          res,
          200,
          "Get all transaction data page " + page,
          result
        );
      }
    } catch (error) {
      return sendErrorResponse(res, 500, "Invernal server error", error);
    }
  },
  getDatabyID: async (req, res) => {
    try {
      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      const userId = req.payload.id;

      if (!userId) {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You must login first to access this page(s).")
        );
      }

      const transaction = await Transaction.findById(id).populate("_userId");

      if (!transaction) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      return sendSuccessResponse(res, 200, "Success", transaction);
    } catch (error) {
      return sendErrorResponse(res, 500, "Internal server error", error);
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

      if (!userId) {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You must login first to access this page(s).")
        );
      }

      let date = Date.now();

      if (!date) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Date must be not empty")
        );
      }

      const dataUpdated = await Transaction.findByIdAndUpdate(
        id,
        { date },
        { new: true }
      );

      if (!dataUpdated) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      return sendSuccessResponse(res, 200, "Success", dataUpdated);
    } catch (error) {
      return sendErrorResponse(res, 500, "Internal server error", error);
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

      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      const userId = req.payload.id;

      if (!userId) {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You must login first to access this page(s).")
        );
      }

      const transaction = await Transaction.findByIdAndDelete(id);
      const transactionDetail = await TransactionDetail.deleteMany({
        _transactionId: id,
      });

      if (!transaction) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      if (!transactionDetail) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction detail not found")
        );
      }

      return sendSuccessResponse(res, 200, "Success", transaction);
    } catch (error) {
      return sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  addData: async (req, res) => {
    try {
      let date = Date.now();
      const userId = req.payload.id;

      if (!date) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Date must be not empty")
        );
      }

      if (!userId) {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You must login first to access this page(s).")
        );
      }

      const newTransaction = await Transaction.create({
        date,
        _userId: userId,
        total: 0,
        status: "pending",
      });

      return sendSuccessResponse(res, 200, "Success", newTransaction);
    } catch (error) {
      return sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};
