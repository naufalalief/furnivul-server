const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const JWT_KEY = process.env.JWT_KEY;
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../../helpers/response.helper");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("Email and password must be not empty")
        );

      const login = await User.findOne({ email });
      if (!login)
        return sendErrorResponse(
          res,
          404,
          "Not found",
          new Error("Email not found")
        );

      const compare = await bcrypt.compare(password, login.password);
      if (compare) {
        const token = jwt.sign(
          { id: login._id, role: login._idRole },
          JWT_KEY,
          { expiresIn: "10h" }
        );
        sendSuccessResponse(res, 200, "Login success", { token });
      } else {
        return sendErrorResponse(
          res,
          400,
          "Wrong password",
          new Error("Wrong password")
        );
      }
    } catch (error) {
      sendErrorResponse(res, 500, "Error login", error);
    }
  },

  register: async (req, res) => {
    try {
      let { fullname, email, password } = req.body;

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return sendErrorResponse(
          res,
          422,
          "Unprocessable Content",
          new Error("Invalid email format")
        );
      }
      if (!fullname || !email || !password) {
        return sendErrorResponse(
          res,
          400,
          "Bad request",
          new Error("all fields are required")
        );
      }

      const salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(password, salt);
      password = hash;
      const user = await User.create({
        fullname,
        email,
        password,
        _idRole: "655d7993226a56f1e4d66883",
      });
      sendSuccessResponse(res, 200, "Success", user);
    } catch (error) {
      sendErrorResponse(res, 500, "Internal server error", error);
    }
  },
};
