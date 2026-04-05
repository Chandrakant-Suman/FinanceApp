const express = require('express');
const { getSummary } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { ROLES } = require('../config/constants');

const router = express.Router();

// All three roles can access dashboard (viewer, analyst, admin)
router.get(
  '/summary',
  authenticate,
  authorize(ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN),
  getSummary
);

module.exports = router;
