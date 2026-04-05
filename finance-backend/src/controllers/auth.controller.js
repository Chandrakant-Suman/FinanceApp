const { registerUser, loginUser } = require('../services/auth.service');
const { sendSuccess } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const result = await registerUser({ name, email, password, role });
  sendSuccess(res, 201, 'User registered successfully.', result);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  sendSuccess(res, 200, 'Login successful.', result);
});

const getMe = catchAsync(async (req, res) => {
  sendSuccess(res, 200, 'User profile fetched.', { user: req.user });
});

module.exports = { register, login, getMe };