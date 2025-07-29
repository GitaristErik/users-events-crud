// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Validation Rules
const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  DESCRIPTION: {
    MAX_LENGTH: 500
  },
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  }
};

// Database Configuration
const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  BUFFER_MAX_ENTRIES: 0
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  VALIDATION_RULES,
  DB_CONFIG,
  PAGINATION
};
