const Transaction = require("../../models/transaction/transaction");
const TransactionDetail = require("../../models/transaction/transaction.detail");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const userId = req.payload.id;

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Failed to get transactions data",
          new Error("You must login first to access this page(s).")
        );
      }

      const transactions = await Transaction.find({ _userId: userId }).populate(
        "_userId"
      );

      if (!transactions) {
        return sendErrorResponse(
          res,
          400,
          "Failed to get transactions data",
          new Error("Transactions not found")
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Get all transaction data success",
        transactions
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Error to get transactions data",
        error
      );
    }
  },
  getDatabyID: async (req, res) => {
    try {
      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Failed to get transaction data",
          new Error("Id not found or empty")
        );
      }

      const userId = req.payload.id;

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Failed to get transaction data",
          new Error("You must login first to access this page(s).")
        );
      }

      const transaction = await Transaction.findById(id).populate("_userId");

      if (!transaction) {
        return sendErrorResponse(
          res,
          400,
          "Failed to get transaction data",
          new Error("Transaction not found")
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Get transaction data success",
        transaction
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Error to get transaction data",
        error
      );
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
          "Failed to update transaction data",
          new Error("Id not found or empty")
        );
      }

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Failed to update transaction data",
          new Error("You must login first to access this page(s).")
        );
      }

      let date = Date.now();

      if (!date) {
        return sendErrorResponse(
          res,
          400,
          "Failed to update transaction data",
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
          400,
          "Failed to update transaction data",
          new Error("Transaction not found")
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Update transaction data success",
        dataUpdated
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Error to update transaction data",
        error
      );
    }
  },

  deleteData: async (req, res) => {
    try {
      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Failed to delete transaction data",
          new Error("Id not found or empty")
        );
      }

      const userId = req.payload.id;

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Failed to delete transaction data",
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
          400,
          "Failed to delete transaction data",
          new Error("Transaction not found")
        );
      }

      if (!transactionDetail) {
        return sendErrorResponse(
          res,
          400,
          "Failed to delete transaction data",
          new Error("Transaction detail not found")
        );
      }

      return sendSuccessResponse(res, 200, "Delete transaction data success", {
        id: transaction._id,
        ...transaction._doc,
        _userId: userId,
      });
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Error to delete transaction data",
        error
      );
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
          "Failed to add transaction data",
          new Error("Date must be not empty")
        );
      }

      if (!userId) {
        return sendErrorResponse(
          res,
          400,
          "Failed to add transaction data",
          new Error("You must login first to access this page(s).")
        );
      }

      const newTransaction = await Transaction.create({
        date,
        _userId: userId,
        total: 0
      });

      return sendSuccessResponse(
        res,
        200,
        "Add transaction data success",
        newTransaction
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Error to add transaction data",
        error
      );
    }
  },
};
