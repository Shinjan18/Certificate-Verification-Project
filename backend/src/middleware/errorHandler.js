const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file streams
const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });
const uploadLogStream = fs.createWriteStream(path.join(logsDir, 'upload.log'), { flags: 'a' });
const verificationLogStream = fs.createWriteStream(path.join(logsDir, 'verification.log'), { flags: 'a' });

/**
 * Log messages to specific log files
 * @param {string} type - Type of log (error, upload, verification)
 * @param {string} message - Log message
 * @param {object} metadata - Additional metadata
 */
const logMessage = (type, message, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}\n`;
  
  switch (type) {
    case 'error':
      errorLogStream.write(logEntry);
      break;
    case 'upload':
      uploadLogStream.write(logEntry);
      break;
    case 'verification':
      verificationLogStream.write(logEntry);
      break;
    default:
      errorLogStream.write(logEntry);
  }
  
  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${type.toUpperCase()}]`, logEntry.trim());
  }
};

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Catch async route handlers
 * @param {function} fn - Async route handler
 * @returns {function} Wrapped route handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
const globalErrorHandler = (err, req, res, next) => {
  // Log error
  logMessage('error', `Error ${err.statusCode || 500}`, {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Default error response
  let errorResponse = {
    success: false,
    message: 'Something went wrong',
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.message : null
  };
  
  let statusCode = 500;
  
  // Handle specific error types
  if (err instanceof APIError) {
    statusCode = err.statusCode;
    errorResponse.message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.message = 'Validation Error';
    errorResponse.error = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorResponse.message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 400;
    errorResponse.message = 'Duplicate field value entered';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse.message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse.message = 'Token expired';
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  APIError,
  catchAsync,
  globalErrorHandler,
  logMessage
};