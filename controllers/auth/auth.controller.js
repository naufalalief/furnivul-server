const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const JWT_KEY = process.env.JWT_KEY;
const sendErrorResponse = require("../../handlers/error.handler");
const sendSuccessResponse = require("../../handlers/success.handler");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return sendErrorResponse(
          res,
          400,
          "Email and password required",
          new Error("Email and password must be not empty")
        );

      const login = await User.findOne({ email });
      if (!login)
        return sendErrorResponse(
          res,
          400,
          "Email not found",
          new Error("Email not found")
        );

      const compare = await bcrypt.compare(password, login.password);
      if (compare) {
        const token = jwt.sign({ id: login._id }, JWT_KEY, { expiresIn: "10h" });
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
          400,
          "Email is not valid",
          new Error("Invalid email format")
        );
      }
      if (!fullname || !email || !password) {
        return sendErrorResponse(
          res,
          400,
          "fullname, email, and password are required",
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
      });
      sendSuccessResponse(res, 200, "Register success", {
        _id: user._id,
        ...user._doc,
      });
    } catch (error) {
      sendErrorResponse(
        res,
        500,
        "Error to create user",
        error
      );
    }
  },
};
