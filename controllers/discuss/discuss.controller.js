const Discuss = require("../../models/discuss/discuss");
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const discusses = await Discuss.find({
        _userId: req.payload.id,
      })
        .populate("_userId")
        .populate("_productId");
      sendSuccessResponse(res, 200, "Get all discusses success", discusses);
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
          "Id not found",
          new Error("Id not found or empty")
        );
      }

      const discuss = await Discuss.findById(id)
        .populate("_userId")
        .populate("_productId");
      sendSuccessResponse(res, 200, "Get discuss by id success", discuss);
    } catch (error) {
      sendErrorResponse(res, 500, "Error get discuss by id", error);
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

      let { _productId, comment } = req.body;

      if (!_productId || !comment) {
        return sendErrorResponse(
          res,
          400,
          "User, product, comment required",
          new Error("User, product, comment must be not empty")
        );
      }

      const updateDiscuss = await Discuss.findByIdAndUpdate(
        id,
        { _productId, comment },
        { new: true }
      );
      sendSuccessResponse(res, 200, "Update discuss success", updateDiscuss);
    } catch (error) {
      sendErrorResponse(res, 500, "Error update discuss", error);
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

      const discuss = await Discuss.findByIdAndDelete(id);
      if (!discuss) {
        return sendErrorResponse(
          res,
          400,
          "Discuss not found",
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
          "User, product, comment required",
          new Error("User, product, comment must be not empty")
        );
      }

      const newDiscuss = new Discuss({
        _userId: req.payload.id,
        _productId,
        comment,
      });
      await newDiscuss.save();
      sendSuccessResponse(res, 200, "Add discuss success", {_id : newDiscuss._id, ...newDiscuss._doc});
    } catch (error) {
      sendErrorResponse(res, 500, "Error add discuss", error);
    }
  },
};
