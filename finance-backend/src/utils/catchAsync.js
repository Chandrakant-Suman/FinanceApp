/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Any thrown error is forwarded to Express's error handler via next().
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
