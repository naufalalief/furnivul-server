const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendErrorResponse = require("../handlers/error.handler");
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

module.exports = auth;
