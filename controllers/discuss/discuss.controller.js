const Discuss = require("../../models/discuss/discuss");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Product = require("../../models/product/product");
const Role = require("../../models/role/role");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const discusses = await Discuss.find().populate("_productId");

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (discusses.length === 0) {
          console.log("Discuss is empty");
          return sendSuccessResponse(res, 200, "Success", "Discuss is empty");
        }

        sendSuccessResponse(res, 200, "Get all discusses success", discusses);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < discusses.length) {
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
        result.discusses = discusses.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all discusses page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all discusses", error);
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

      const discuss = await Discuss.findById(id)
        .populate("_productId")
        .populate("_userId");

      console.log(discuss._userId);
      sendSuccessResponse(res, 200, "Get discuss by id success", discuss);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get discuss by id", error);
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

      let { comment } = req.body;

      if (!comment) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("User, product, comment must be not empty")
        );
      }

      const discuss = await Discuss.findById(id);

      if (userId !== discuss._userId.toString()) {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("User not authorized")
        );
      }

      const updateDiscuss = await Discuss.findByIdAndUpdate(
        id,
        { comment },
        { new: true }
      );

      if (!updateDiscuss) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Discuss not found")
        );
      }

      sendSuccessResponse(res, 200, "Update discuss success", updateDiscuss);
    } catch (error) {
      sendErrorResponse(res, 500, "Error update discuss", error);
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

      const discuss = await Discuss.findByIdAndDelete(id);
      if (!discuss) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Discuss not found")
        );
      }

      sendSuccessResponse(res, 200, "Delete discuss success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete discuss", error);
    }
  },

  addData: async (req, res) => {
    try {
      let { _productId, comment } = req.body;

      if (!_productId || !comment) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("User, product, comment must be not empty")
        );
      }

      const isExist = await Product.findById(_productId);

      if (!isExist) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Product not found")
        );
      }

      const newDiscuss = new Discuss({
        _userId: req.payload.id,
        _productId,
        comment,
      });
      await newDiscuss.save();
      sendSuccessResponse(res, 200, "Success", newDiscuss);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};
