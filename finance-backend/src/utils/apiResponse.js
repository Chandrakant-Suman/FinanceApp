const sendSuccess = (res, statusCode, message, data = {}) => {
  const response = { success: true, message };
  if (Object.keys(data).length > 0) response.data = data;
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { sendSuccess, sendPaginated };
