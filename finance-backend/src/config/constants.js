const ROLES = Object.freeze({
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin',
});

const TRANSACTION_TYPES = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
});

const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

module.exports = { ROLES, TRANSACTION_TYPES, USER_STATUS };
