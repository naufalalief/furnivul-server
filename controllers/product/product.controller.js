const Product = require("../../models/product/product");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const products = await Product.find()
        .populate("_categoryId")
        .populate("_typeId");

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (products.length === 0) {
          return sendSuccessResponse(res, 200, "Success", "Product is empty");
        }

        sendSuccessResponse(res, 200, "Success", products);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < products.length) {
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
        result.products = products.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all products page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
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

      const product = await Product.findById(id)
        .populate("_categoryId")
        .populate("_typeId");
      sendSuccessResponse(res, 200, "Success", product);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  updateData: async (req, res) => {
    try {
      const { role } = req.payload;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You are not authorized to access this feature")
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
        !product_price ||
        !product_image
      ) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
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

      if (!updateProduct) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Product not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", updateProduct);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  deleteData: async (req, res) => {
    try {
      const { role } = req.payload;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You are not authorized to access this feature")
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
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Product not found")
        );
      }
      sendSuccessResponse(res, 200, "Success");
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  addData: async (req, res) => {
    try {
      const { role } = req.payload;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          401,
          "Unauthorized",
          new Error("You are not authorized to access this feature")
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
      sendSuccessResponse(res, 200, "Add product success", newProduct);
    } catch (error) {
      sendErrorResponse(res, 500, "Error add product", error);
    }
  },
};
