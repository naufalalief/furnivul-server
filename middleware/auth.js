const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendErrorResponse } = require("../helpers/response.helper");
const Role = require("../models/role/role");
const JWT_KEY = process.env.JWT_KEY;

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header)
      return sendErrorResponse(
        res,
        400,
        "Authorization header required",
        new Error("Authorization header must be provided")
      );

    const token = header.split(" ")[1];
    if (!token)
      return sendErrorResponse(
        res,
        400,
        "Token required",
        new Error("Token must be provided")
      );

    const decoded = jwt.verify(token, JWT_KEY);
    req.payload = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(res, 500, "Error authorization", error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const role = req.payload.role;
    const adminRole = await Role.findById(role);
    console.log(adminRole._id, role);
    if (adminRole._id.toString() !== role) {
      return sendErrorResponse(
        res,
        403,
        "Forbidden access",
        new Error("You are logged in as user")
      );
    }
    next();
  } catch (error) {
    return sendErrorResponse(res, 500, "Error authorization", error);
  }
};

module.exports = { auth, isAdmin };
