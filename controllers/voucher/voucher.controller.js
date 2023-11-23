const Voucher = require("../../models/voucher/voucher");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");
const Role = require("../../models/role/role");

module.exports = {
  getAllData: async (req, res) => {
    try {
      const vouchers = await Voucher.find();
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      if (!page || !limit) {
        if (vouchers.length === 0) {
          return sendSuccessResponse(
            res,
            200,
            "Success",
            "Voucher is empty"
          );
        }
        sendSuccessResponse(res, 200, "Success", vouchers);
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < vouchers.length) {
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
        result.vouchers = vouchers.slice(startIndex, endIndex);

        sendSuccessResponse(res, 200, "Get all vouchers page " + page, result);
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
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

      const voucher = await Voucher.findById(id);

      if (!voucher) {
        return sendErrorResponse(
          res,
          404,
          "Voucher not found",
          new Error("Voucher not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", voucher);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
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

      const { id } = req.params;
      let { name, discount, description, code, start_date, end_date } =
        req.body;

      if (!id) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Id not found or empty")
        );
      }

      if (
        !name ||
        !discount ||
        !description ||
        !code ||
        !start_date ||
        !end_date
      ) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Fields must be not empty")
        );
      }

      const currentDate = new Date();
      const isActive = new Date(end_date) > currentDate;

      const update = await Voucher.findByIdAndUpdate(
        id,
        { name, discount, description, code, start_date, end_date, isActive },
        { new: true }
      );

      if (!update) {
        return sendErrorResponse(
          res,
          404,
          "Voucher not found",
          new Error("Voucher not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", update);
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
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

      const voucher = await Voucher.findByIdAndDelete(id);
      if (!voucher) {
        return sendErrorResponse(
          res,
          404,
          "Voucher not found",
          new Error("Voucher not found")
        );
      }

      sendSuccessResponse(res, 200, "Success", voucher);
    } catch (error) {
      sendErrorResponse(res, 500, "Invernal server error", error);
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

      let { name, discount, description, code, start_date, end_date } =
        req.body;

      if (
        !name ||
        !discount ||
        !description ||
        !code ||
        !start_date ||
        !end_date
      ) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error(
            "name, discount, description, code, start_date, end_date must be filled"
          )
        );
      }

      const currentDate = new Date();
      const isActive = new Date(end_date) > currentDate;

      const voucher = await Voucher.create({
        name,
        discount,
        description,
        code,
        start_date,
        end_date,
        isActive,
      });

      sendSuccessResponse(res, 201, "Success", voucher);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};

const checkVoucherStatus = () => {
  Voucher.find().then(vouchers => {
    const currentDate = new Date();

    vouchers.forEach(voucher => {
      if (voucher.isActive === true) {
        if (currentDate > voucher.end_date) {
          voucher.isActive = false;
          voucher.save().catch(error => console.error(error));
        }
      }
    });
  }).catch(error => console.error(error));
};

checkVoucherStatus();

setInterval(checkVoucherStatus, 24 * 60 * 60 * 1000);