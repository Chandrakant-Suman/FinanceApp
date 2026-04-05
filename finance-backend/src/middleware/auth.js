const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const authenticate = catchAsync(async (req, res, next) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if user still exists and is active
  const user = await User.findById(decoded.id).select('+status');
  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (user.status === 'inactive') {
    return next(new AppError('Your account has been deactivated. Contact an admin.', 403));
  }

  req.user = user;
  next();
});

module.exports = { authenticate };
