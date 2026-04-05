const { getAllUsers, updateUserRoleOrStatus } = require('../services/user.service');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

const getUsers = catchAsync(async (req, res) => {
  const { page, limit, role, status, search } = req.query;
  const result = await getAllUsers({ page, limit, role, status, search });
  sendPaginated(res, 'Users fetched successfully.', result.users, result.pagination);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await updateUserRoleOrStatus(req.params.id, req.body);
  sendSuccess(res, 200, 'User updated successfully.', { user });
});

module.exports = { getUsers, updateUser };
