const Reply = require("../../models/discuss/reply");
const Discuss = require("../../models/discuss/discuss");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const User = require("../../models/user");
const Role = require("../../models/role/role");
module.exports = {
  getAllReply: async (req, res) => {
    try {
      const role = req.payload.role;

      const checkRole = await Role.findById(role);
      if (checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You don't have access to this feature(s).")
        );
      }

      const replies = await Reply.find()
        .populate("_discussId")
        .populate("_userId");

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (replies.length === 0) {
          console.log("Reply is empty");
          return sendSuccessResponse(res, 200, "Success", "Reply is empty");
        }

        sendSuccessResponse(res, 200, "Get all replies success", replies);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < replies.length) {
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
        result.replies = replies.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all replies page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all replies", error);
    }
  },

  getAllData: async (req, res) => {
    try {
      const _discussId = req.params.id;
      const replies = await Reply.find({
        _discussId,
      })
        .populate("_discussId")
        .populate("_userId");

      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (replies.length === 0) {
          console.log("Reply is empty");
          return sendSuccessResponse(res, 200, "Success", "Reply is empty");
        }

        sendSuccessResponse(res, 200, "Get all replies success", replies);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < replies.length) {
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
        result.replies = replies.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all replies page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error get all replies", error);
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

      const reply = await Reply.findById(id)
        .populate("_discussId")
        .populate("_userId");

      if (!reply) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Reply not found")
        );
      }

      sendSuccessResponse(res, 200, "Get reply by id success", reply);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  updateData: async (req, res) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;
      const userId = req.payload.id;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      if (!reply) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Reply not found or empty")
        );
      }

      const isExist = await Reply.findById(id);

      if (!isExist) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Reply not found")
        );
      }

      if (isExist._userId.toString() !== userId) {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You can't update this reply")
        );
      }

      const updateReply = await Reply.findByIdAndUpdate(
        id,
        {
          reply: reply,
        },
        { new: true }
      );

      sendSuccessResponse(res, 200, "Update reply success", updateReply);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  deleteData: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.payload.id;
      const role = req.payload.role;
      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      const isExist = await Reply.findById(id);

      if (!isExist) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Reply not found")
        );
      }

      const checkRole = await Role.findById(role);

      if (isExist._userId.toString() !== userId && checkRole.role !== "admin") {
        return sendErrorResponse(
          res,
          403,
          "Forbidden",
          new Error("You can't delete this reply")
        );
      }

      const reply = await Reply.findByIdAndDelete(id);

      if (!reply) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Reply not found")
        );
      }

      sendSuccessResponse(res, 200, "Delete reply success", reply);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },

  addData: async (req, res) => {
    try {
      const userId = req.payload.id;
      const _discussId = req.params.id;
      const { reply } = req.body;
      if (!_discussId || !reply) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Data not found or empty")
        );
      }

      const checkDiscuss = await Discuss.findById(_discussId);
      if (!checkDiscuss) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Discuss not found")
        );
      }

      const checkUser = await User.findById(userId);
      if (!checkUser) {
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("User not found")
        );
      }

      const newReply = new Reply({
        _discussId,
        _userId: userId,
        reply,
      });

      const saveReply = await newReply.save();

      sendSuccessResponse(res, 200, "Add reply success", saveReply);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};
