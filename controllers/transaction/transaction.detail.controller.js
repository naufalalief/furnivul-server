const Transaction = require("../../models/transaction/transaction");
const TransactionDetail = require("../../models/transaction/transaction.detail");
const Product = require("../../models/product/product");
const CourierService = require("../../models/courier/courier.service");
const Voucher = require("../../models/voucher/voucher");

const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

const validateRequest = (req, res) => {
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

  let {
    _transactionId,
    _productId,
    _courierId,
    _courierServiceId,
    _voucherId,
    qty,
  } = req.body;

  if (
    !_transactionId ||
    !_productId ||
    !_courierId ||
    !_courierServiceId ||
    !qty
  ) {
    return sendErrorResponse(
      res,
      400,
      "Bad request",
      new Error("All fields must be not empty")
    );
  }

  return {
    id,
    userId,
    _transactionId,
    _productId,
    _courierId,
    _courierServiceId,
    _voucherId,
    qty,
  };
};

const fetchDataForUpdate = async (
  _productId,
  _courierServiceId,
  id,
  _transactionId
) => {
  const product = await Product.findById(_productId);
  const courierService = await CourierService.findById(_courierServiceId);
  const oldTransactionDetail = await TransactionDetail.findById(id);
  const transaction = await Transaction.findById(
    oldTransactionDetail._transactionId
  );
  const allTransactionDetails = await TransactionDetail.find({
    _transactionId: _transactionId,
  });

  if (!product) {
    return sendErrorResponse(
      res,
      404,
      "Not found",
      new Error("Product not found")
    );
  }

  if (!courierService) {
    return sendErrorResponse(
      res,
      404,
      "Not found",
      new Error("Courier service not found")
    );
  }

  if (!oldTransactionDetail) {
    return sendErrorResponse(
      res,
      404,
      "Not found",
      new Error("Transaction detail not found")
    );
  }

  if (!transaction) {
    return sendErrorResponse(
      res,
      404,
      "Not found",
      new Error("Transaction not found")
    );
  }

  if (!allTransactionDetails) {
    return sendErrorResponse(
      res,
      404,
      "Not found",
      new Error("Transaction details not found")
    );
  }

  return { product, courierService, transaction, allTransactionDetails };
};

const calculateTotal = async (
  _voucherId,
  courierService,
  allTransactionDetails
) => {
  let total = allTransactionDetails.reduce(
    (total, detail) => total + detail.subtotal,
    0
  );

  if (_voucherId) {
    const discount = await Voucher.findById(_voucherId);
    if (discount) {
      total = total + courierService.cost - discount.discount;
    }
  } else {
    total = total + courierService.cost;
  }

  return total;
};

module.exports = {
  getAllDataTransactionDetails: async (req, res) => {
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

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      let transactions = await Transaction.find()
        .populate("_transactionId")
        .populate("_productId")
        .populate("_courierId")
        .populate("_courierServiceId")
        .populate("_voucherId");

      if (!page || !limit) {
        if (transactions.length === 0) {
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Transaction is empty"
          );
        }

        return sendSuccessResponse(
          res,
          200,
          "Success",
          transactions
        );
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
      return sendErrorResponse(
        res,
        500,
        "Internal server error",
        error
      );
    }
  },

  getAllData: async (req, res) => {
    try {
      let userId = req.payload.id;
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!userId) {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You must login first to access this page(s).")
        );
      }

      let transactions = await Transaction.find({ _userId: userId }).populate(
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

      let transactionsDetail = [];

      for (let transaction of transactions) {
        let detail = await TransactionDetail.find({
          _transactionId: transaction._id,
        })
          .populate("_transactionId")
          .populate("_productId")
          .populate("_courierId")
          .populate("_courierServiceId")
          .populate("_voucherId");

        transactionsDetail.push(...detail);
      }

      if (!page || !limit) {
        if (transactionsDetail.length === 0) {
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Transaction is empty"
          );
        }

        return sendSuccessResponse(
          res,
          200,
          "Success",
          transactionsDetail
        );
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < transactionsDetail.length) {
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
        result.transactions = transactionsDetail.slice(startIndex, endIndex);

        return sendSuccessResponse(
          res,
          200,
          "Get all transaction data page " + page,
          result
        );
      }
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Invernal server error",
        error
      );
    }
  },
  getDatabyID: async (req, res) => {
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

      const transactionDetail = await TransactionDetail.findById(id)
        .populate("_transactionId")
        .populate("_productId")
        .populate("_courierId")
        .populate("_courierServiceId");

      if (!transactionDetail) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction detail not found")
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Success",
        transactionDetail
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Internal server error",
        error
      );
    }
  },
  updateData: async (req, res) => {
    try {
      // get validate from validateRequest function
      let {
        id,
        userId,
        _transactionId,
        _productId,
        _courierId,
        _courierServiceId,
        _voucherId,
        qty,
      } = validateRequest(req, res);

      // get data from fetchDataForUpdate function
      const { product, courierService, transaction } = await fetchDataForUpdate(
        _productId,
        _courierServiceId,
        id,
        _transactionId
      );

      // check if user is authorized to update transaction data
      if (transaction._userId.toString() !== userId) {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You are not authorized to access this page(s).")
        );
      }

      const checkTransactionId = await Transaction.findOne({
        _userId: userId,
        _id: _transactionId,
      });

      if (!checkTransactionId) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      // calculate subtotal by product price and qty
      const subtotal = product.product_price * qty;

      // define update object to update transaction detail
      let updateObject = {
        _transactionId,
        _productId,
        _courierId,
        _courierServiceId,
        qty,
        subtotal,
      };

      // check if voucher id exists or not and if exists, add to update object
      if (_voucherId) {
        updateObject._voucherId = _voucherId;
      } else {
        updateObject._voucherId = null;
      }

      // update transaction detail and check if success or not
      const updatedTransactionDetail =
        await TransactionDetail.findByIdAndUpdate(id, updateObject, {
          new: true,
        });

      if (!updatedTransactionDetail) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Failed to update transaction detail")
        );
      }

      // Recalculate total for all transaction details
      const updatedTransactionDetails = await TransactionDetail.find({
        _transactionId: _transactionId,
      });

      const total = await calculateTotal(
        _voucherId,
        courierService,
        updatedTransactionDetails
      );

      // update transaction total and check if success return true or false
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        _transactionId,
        { total: total },
        { new: true }
      );

      if (!updatedTransaction) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Failed to update transaction total")
        );
      }

      return sendSuccessResponse(
        res,
        200,
        "Update transaction data success",
        updatedTransactionDetail
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Internal server error",
        error
      );
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
          "Failed to delete transaction data",
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

      const transactionDetail = await TransactionDetail.findById(id);

      if (!transactionDetail) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction detail not found")
        );
      }

      const transaction = await Transaction.findById(
        transactionDetail._transactionId
      );

      if (!transaction) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Transaction not found")
        );
      }

      if (transaction._userId.toString() !== userId) {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You are not authorized to access this page(s).")
        );
      }

      const total = transaction.total - transactionDetail.subtotal;

      await Transaction.findByIdAndUpdate(transactionDetail._transactionId, {
        total,
      });

      await TransactionDetail.findByIdAndDelete(id);

      return sendSuccessResponse(
        res,
        200,
        "Success",
        transactionDetail
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Internal server error",
        error
      );
    }
  },
  addData: async (req, res) => {
    try {
      let {
        _transactionId,
        products,
        _courierId,
        _courierServiceId,
        _voucherId,
      } = req.body;
      let userId = req.payload.id;

      if (!_transactionId || !products || !_courierId || !_courierServiceId) {
        return sendErrorResponse(
          res,
          400,
          "All fields required",
          new Error("All fields must be not empty")
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

      const courierService = await CourierService.findById(_courierServiceId);

      if (!courierService) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Courier service not found")
        );
      }

      const transaction = await Transaction.findById(_transactionId);

      if (!transaction) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      const isExist = await Transaction.findOne({
        _userId: userId,
        _id: _transactionId,
      });

      if (!isExist) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Transaction not found")
        );
      }

      let totalSubtotal = 0;
      let transactionDetails = [];

      for (let productData of products) {
        const product = await Product.findById(productData._productId);

        if (!product) {
          return sendErrorResponse(
            res,
            404,
            "Not found",
            new Error("Product not found")
          );
        }

        const subtotal = product.product_price * productData.qty;
        totalSubtotal += subtotal;

        const newTransactionDetail = await TransactionDetail.create({
          _transactionId,
          _productId: productData._productId,
          _courierId,
          _courierServiceId,
          _voucherId,
          qty: productData.qty,
          subtotal,
        });

        transactionDetails.push(newTransactionDetail);
      }

      let total = 0;

      if (_voucherId) {
        const discount = await Voucher.findById(_voucherId);
        if (discount) {
          total = totalSubtotal + courierService.cost - discount.discount;
        }
      } else {
        total = totalSubtotal + courierService.cost;
      }

      transaction.total = total;
      await transaction.save();

      return sendSuccessResponse(res, 200, "Success", {
        transactionDetails,
        totalSubtotal,
        courierService: courierService.cost,
        total,
      });
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Internal server error",
        error
      );
    }
  },
};
