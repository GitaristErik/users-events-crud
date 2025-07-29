/**
 * Standardized response utilities for consistent API responses
 */

// Success response helper
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data
  };
  
  // Remove data field if null
  if (data === null) {
    delete response.data;
  }
  
  return res.status(statusCode).json(response);
};

// Error response helper
const sendError = (res, error, statusCode = 500) => {
  const response = {
    success: false,
    message: error.message || 'Internal server error'
  };
  
  // Add error details if provided
  if (error.errors) {
    response.errors = error.errors;
  }
  
  return res.status(statusCode).json(response);
};

// Async handler wrapper to catch errors automatically
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return sendError(res, { message: 'Validation failed', errors }, 400);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, { message: `${field} already exists` }, 400);
  }
  
  // Mongoose ObjectId error
  if (err.name === 'CastError') {
    return sendError(res, { message: 'Invalid ID format' }, 400);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, { message: 'Invalid token' }, 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return sendError(res, { message: 'Token expired' }, 401);
  }
  
  // Default error
  sendError(res, err, err.statusCode || 500);
};

module.exports = {
  sendSuccess,
  sendError,
  asyncHandler,
  errorHandler
};