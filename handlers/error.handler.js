const sendErrorResponse = (res, status, message, error) => {
  res.status(status).json({
    message,
    error: error.message,
  });
};

module.exports = sendErrorResponse;