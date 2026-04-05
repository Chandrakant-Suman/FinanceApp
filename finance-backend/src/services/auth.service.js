const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already in use.', 409);

  const user = await User.create({ name, email, password, role });
  const token = signToken(user._id);

  return { user: sanitizeUser(user), token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +status');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.status === 'inactive') {
    throw new AppError('Your account has been deactivated. Contact an admin.', 403);
  }

  const token = signToken(user._id);
  return { user: sanitizeUser(user), token };
};

// Strip sensitive fields before sending user data in response
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

module.exports = { registerUser, loginUser };
