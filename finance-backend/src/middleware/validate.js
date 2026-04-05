const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Runs after express-validator chains. Collects all errors and
 * returns a 422 response if any validation rules were violated.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages.join('. '), 422));
  }
  next();
};

module.exports = { validate };
