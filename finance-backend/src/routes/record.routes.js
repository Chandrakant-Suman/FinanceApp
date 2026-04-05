const express = require('express');
const { body, param } = require('express-validator');
const { create, getAll, update, remove } = require('../controllers/record.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { ROLES, TRANSACTION_TYPES } = require('../config/constants');

const router = express.Router();

router.use(authenticate);

const recordBodyValidators = [
  body('amount')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number.'),
  body('type')
    .isIn(Object.values(TRANSACTION_TYPES))
    .withMessage(`Type must be one of: ${Object.values(TRANSACTION_TYPES).join(', ')}.`),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters.'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date.'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters.'),
];

// Admin: create, update, delete | Analyst + Admin: read
router.post('/', authorize(ROLES.ADMIN), recordBodyValidators, validate, create);

router.get('/', authorize(ROLES.ANALYST, ROLES.ADMIN), getAll);

router.patch(
  '/:id',
  authorize(ROLES.ADMIN),
  [
    param('id').isMongoId().withMessage('Invalid record ID.'),
    ...recordBodyValidators.map((v) => v.optional()),
  ],
  validate,
  update
);

router.delete(
  '/:id',
  authorize(ROLES.ADMIN),
  [param('id').isMongoId().withMessage('Invalid record ID.')],
  validate,
  remove
);

module.exports = router;
