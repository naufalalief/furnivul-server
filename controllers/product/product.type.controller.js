const ProductType = require("../../models/product/product.type");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const productTypes = await ProductType.find();

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (productTypes.length === 0) {
          return sendSuccessResponse(
            res,
            204,
            "Get all product types success",
            "Product type is empty"
          );
        }

        sendSuccessResponse(
          res,
          200,
          "Get all product types success",
          productTypes
        );
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < productTypes.length) {
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
        result.productTypes = productTypes.slice(startIndex, endIndex);

        sendSuccessResponse(
          res,
          200,
          "Get all product types page " + page,
          result
        );
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all product types", error);
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

      const productType = await ProductType.findById(id);
      sendSuccessResponse(
        res,
        200,
        "Get product type by id success",
        productType
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error get product type by id", error);
    }
  },

  updateData: async (req, res) => {
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

      let { type, description } = req.body;
      if (!type || !description) {
        return sendErrorResponse(
          res,
          400,
          "Type and description required",
          new Error("Type and description must be not empty")
        );
      }

      const updateProductType = await ProductType.findByIdAndUpdate(
        id,
        { type, description },
        { new: true }
      );

      if (!updateProductType) {
        return sendErrorResponse(
          res,
          400,
          "Product type not found",
          new Error("Product type not found")
        );
      }

      sendSuccessResponse(
        res,
        200,
        "Update product type success",
        updateProductType
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error update product type", error);
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

      const producttype = await ProductType.findByIdAndDelete(id);
      if (!producttype) {
        return sendErrorResponse(
          res,
          400,
          "Product type not found",
          new Error("Product type not found")
        );
      }
      sendSuccessResponse(res, 200, "Delete product type success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete product type", error);
    }
  },

  addData: async (req, res) => {
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

      let { type, description } = req.body;
      if (!type || !description) {
        return sendErrorResponse(
          res,
          400,
          "Type and description required",
          new Error("Type and description must be not empty")
        );
      }

      const checkType = await ProductType.find({ type });
      if (checkType.length > 0) {
        return sendErrorResponse(
          res,
          400,
          "Type already exist",
          new Error("Type already exist")
        );
      }

      const newProductType = await ProductType.create({
        type,
        description,
      });
      sendSuccessResponse(res, 200, "Add product type success", {
        _id: newProductType._id,
        ...newProductType._doc,
      });
    } catch (error) {
      sendErrorResponse(res, 500, "Error add product type", error);
    }
  },
};
