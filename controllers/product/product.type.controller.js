const ProductType = require("../../models/product/product.type");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const productTypes = await ProductType.find();
      sendSuccessResponse(
        res,
        200,
        "Get all product types success",
        productTypes
      );
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
          "Id not found",
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
      let { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
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
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
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
      let { type, description } = req.body;
      if (!type || !description) {
        return sendErrorResponse(
          res,
          400,
          "Type and description required",
          new Error("Type and description must be not empty")
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
