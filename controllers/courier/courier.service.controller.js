const CourierServices = require("../../models/courier/courier.service");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const courierServices = await CourierServices.find();

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (courierServices.length === 0) {
          console.log("Courier service is empty");
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Courier service is empty"
          );
        }

        sendSuccessResponse(res, 200, "Success", courierServices);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < courierServices.length) {
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
        result.courierServices = courierServices.slice(startIndex, endIndex);

        sendSuccessResponse(
          res,
          200,
          "Get all courier services page " + page,
          result
        );
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all courier services", error);
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

      const courierService = await CourierServices.findById(id);
      sendSuccessResponse(
        res,
        200,
        "Get courier service by id success",
        courierService
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error get courier service by id", error);
    }
  },

  updateData: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
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

      let { name, description, etd, cost } = req.body;
      if (!name || !description || !etd || !cost) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Name, description, etd, cost must be not empty")
        );
      }

      const updateCourierService = await CourierServices.findByIdAndUpdate(
        id,
        { name, description, etd, cost },
        { new: true }
      );

      if (!updateCourierService) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Courier service not found")
        );
      }

      sendSuccessResponse(
        res,
        200,
        "Update courier service success",
        updateCourierService
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error update courier service", error);
    }
  },
  deleteData: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
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

      const courierservices = await CourierServices.findByIdAndDelete(id);
      if (!courierservices) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Courier service not found")
        );
      }
      sendSuccessResponse(res, 200, "Delete courier service success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete courier service", error);
    }
  },

  addData: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You are not admin")
        );
      }

      let { name, description, etd, cost } = req.body;
      if (!name || !description || !etd || !cost) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Name, description, etd, cost must be not empty")
        );
      }

      const newCourierService = await CourierServices.create({
        name,
        description,
        etd,
        cost,
      });
      sendSuccessResponse(
        res,
        200,
        "Add courier service success",
        newCourierService
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error add courier service", error);
    }
  },
};
