const sendSuccessResponse = (res, status, message, data) => {
  res.status(status).json({
    message,
    data,
  });
};

const sendErrorResponse = (res, status, message, error) => {
  console.error(error);
  res.status(status).json({
    status: 'error',
    message,
    error: error.message,
  });
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};