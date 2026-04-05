const express = require('express');
const { param, body } = require('express-validator');
const { getUsers, updateUser } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { ROLES, USER_STATUS } = require('../config/constants');

const router = express.Router();

// All user management routes require authentication + admin role
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/', getUsers);

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid user ID.'),
    body('role')
      .optional()
      .isIn(Object.values(ROLES))
      .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}.`),
    body('status')
      .optional()
      .isIn(Object.values(USER_STATUS))
      .withMessage(`Status must be one of: ${Object.values(USER_STATUS).join(', ')}.`),
  ],
  validate,
  updateUser
);

module.exports = router;
