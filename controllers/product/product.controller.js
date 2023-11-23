const Product = require("../../models/product/product");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const products = await Product.find()
        .populate("_categoryId")
        .populate("_typeId");
      sendSuccessResponse(res, 200, "Get all products success", products);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all products", error);
    }
  },

  getDatabyID: async (req, res) => {
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

      const product = await Product.findById(id)
        .populate("_categoryId")
        .populate("_typeId");
      sendSuccessResponse(res, 200, "Get product by id success", product);
    } catch (error) {}
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

      let {
        product_name,
        _categoryId,
        product_description,
        _typeId,
        product_material,
        product_rate,
        product_sold,
        product_review,
        product_price,
        product_image,
      } = req.body;
      if (
        !product_name ||
        !_categoryId ||
        !product_description ||
        !_typeId ||
        !product_material ||
        !product_rate ||
        !product_sold ||
        !product_review ||
        !product_price ||
        !product_image
      ) {
        return sendErrorResponse(
          res,
          400,
          "Product name, category, description, type, material, rate, sold, review, price, image required",
          new Error(
            "Product name, category, description, type, material, rate, sold, review, price, image must be not empty"
          )
        );
      }

      const updateProduct = await Product.findByIdAndUpdate(
        id,
        {
          product_name,
          _categoryId,
          product_description,
          _typeId,
          product_material,
          product_rate,
          product_sold,
          product_review,
          product_price,
          product_image,
        },
        { new: true }
      );
      sendSuccessResponse(res, 200, "Update product success", updateProduct);
    } catch (error) {
      sendErrorResponse(res, 500, "Error update product", error);
    }
  },

  deleteData: async (req, res) => {
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
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return sendErrorResponse(
          res,
          400,
          "Product not found",
          new Error("Product not found")
        );
      }
      sendSuccessResponse(res, 200, "Delete product success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete product", error);
    }
  },

  addData: async (req, res) => {
    try {
      let {
        product_name,
        _categoryId,
        product_description,
        _typeId,
        product_material,
        product_rate,
        product_sold,
        product_review,
        product_price,
        product_image,
      } = req.body;
      if (
        !product_name ||
        !_categoryId ||
        !product_description ||
        !_typeId ||
        !product_material ||
        !product_rate ||
        !product_sold ||
        !product_review ||
        !product_price ||
        !product_image
      ) {
        return sendErrorResponse(
          res,
          400,
          "Product name, category, description, type, material, rate, sold, review, price, image required",
          new Error(
            "Product name, category, description, type, material, rate, sold, review, price, image must be not empty"
          )
        );
      }

      const newProduct = await Product.create({
        product_name,
        _categoryId,
        product_description,
        _typeId,
        product_material,
        product_rate,
        product_sold,
        product_review,
        product_price,
        product_image,
      });
      sendSuccessResponse(res, 200, "Add product success", {
        _id: newProduct._id,
        ...newProduct._doc,
      });
    } catch (error) {
      sendErrorResponse(res, 500, "Error add product", error);
    }
  },
};
