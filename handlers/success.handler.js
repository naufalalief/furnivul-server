const sendSuccessResponse = (res, status, message, data) => {
  res.status(status).json({
    message,
    data,
  });
};

module.exports = sendSuccessResponse;