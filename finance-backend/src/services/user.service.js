const User = require('../models/User');
const AppError = require('../utils/AppError');
const { ROLES, USER_STATUS } = require('../config/constants');

const getAllUsers = async ({ page = 1, limit = 10, role, status, search }) => {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUserRoleOrStatus = async (userId, { role, status }) => {
  if (!role && !status) {
    throw new AppError('Provide at least one field to update: role or status.', 400);
  }

  const allowedRoles = Object.values(ROLES);
  const allowedStatuses = Object.values(USER_STATUS);

  if (role && !allowedRoles.includes(role)) {
    throw new AppError(`Invalid role. Allowed: ${allowedRoles.join(', ')}`, 400);
  }
  if (status && !allowedStatuses.includes(status)) {
    throw new AppError(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`, 400);
  }

  const updates = {};
  if (role) updates.role = role;
  if (status) updates.status = status;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select('-__v');

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

module.exports = { getAllUsers, updateUserRoleOrStatus };
