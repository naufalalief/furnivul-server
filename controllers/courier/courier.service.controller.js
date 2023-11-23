const CourierServices = require("../../models/courier/courier.service");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const courierServices = await CourierServices.find();
      sendSuccessResponse(
        res,
        200,
        "Get all courier services success",
        courierServices
      );
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
          "Id not found",
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
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      let { name, description, etd, cost } = req.body;
      if (!name || !description || !etd || !cost) {
        return sendErrorResponse(
          res,
          400,
          "Name, description, etd, cost required",
          new Error("Name, description, etd, cost must be not empty")
        );
      }

      const updateCourierService = await CourierServices.findByIdAndUpdate(
        id,
        { name, description, etd, cost },
        { new: true }
      );
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
      const { id } = req.params;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      const courierservices = await CourierServices.findByIdAndDelete(id);
      if (!courierservices) {
        return sendErrorResponse(
          res,
          400,
          "Courier service not found",
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
      let { name, description, etd, cost } = req.body;
      if (!name || !description || !etd || !cost) {
        return sendErrorResponse(
          res,
          400,
          "Name, description, etd, cost required",
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
        {_id: newCourierService.id, ...newCourierService._doc}
      );
    } catch (error) {
      sendErrorResponse(res, 500, "Error add courier service", error);
    }
  },
};
