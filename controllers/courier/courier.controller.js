const Courier = require("../../models/courier/courier");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const couriers = await Courier.find().populate("_idCourierService");
      sendSuccessResponse(res, 200, "Get all couriers success", couriers);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all couriers", error);
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

      const courier = await Courier.findById(id).populate("_idCourierService");
      sendSuccessResponse(res, 200, "Get courier by id success", courier);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get courier by id", error);
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

      let { courier, _idCourierService } = req.body;
      if (!courier || !_idCourierService) {
        return sendErrorResponse(
          res,
          400,
          "Courier and courier service required",
          new Error("Courier and courier service must be not empty")
        );
      }

      const updateCourier = await Courier.findByIdAndUpdate(
        id,
        { courier, _idCourierService },
        { new: true }
      );
      sendSuccessResponse(res, 200, "Update courier success", updateCourier);
    } catch (error) {
      sendErrorResponse(res, 500, "Error update courier", error);
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

      const courier = await Courier.findByIdAndDelete(id);
      if (!courier) {
        return sendErrorResponse(
          res,
          400,
          "Courier not found",
          new Error("Courier not found")
        );
      }
      sendSuccessResponse(res, 200, "Delete courier success");
    } catch (error) {
      sendErrorResponse(res, 500, "Error delete courier", error);
    }
  },
  addData: async (req, res) => {
    try {
      let { courier, _idCourierService } = req.body;
      if (!courier || !_idCourierService) {
        return sendErrorResponse(
          res,
          400,
          "Courier and courier service required",
          new Error("Courier and courier service must be not empty")
        );
      }

      const newCourier = await Courier.create({
        courier,
        _idCourierService,
      });
      sendSuccessResponse(res, 200, "Add courier success", {_id : newCourier._id, ...newCourier._doc});
    } catch (error) {
      sendErrorResponse(res, 500, "Error add courier", error);
    }
  },
};
