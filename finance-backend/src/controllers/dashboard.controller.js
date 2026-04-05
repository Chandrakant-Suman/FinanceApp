const { getDashboardSummary } = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

const getSummary = catchAsync(async (req, res) => {
  const summary = await getDashboardSummary();
  sendSuccess(res, 200, 'Dashboard summary fetched.', { summary });
});

module.exports = { getSummary };
