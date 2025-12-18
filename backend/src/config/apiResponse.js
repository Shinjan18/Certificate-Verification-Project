/**
 * Standardized API response utility
 */

const apiResponse = {
  /**
   * Success response
   * @param {any} data - Response data
   * @param {string} message - Success message
   * @returns {object} Formatted success response
   */
  success: (data = null, message = 'Success') => ({
    success: true,
    message,
    data
  }),

  /**
   * Error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @returns {object} Formatted error response
   */
  error: (message = 'An error occurred', statusCode = 500) => ({
    success: false,
    message,
    data: null,
    statusCode
  }),

  /**
   * Not found response
   * @param {string} message - Not found message
   * @returns {object} Formatted not found response
   */
  notFound: (message = 'Resource not found') => ({
    success: false,
    message,
    data: null,
    statusCode: 404
  }),

  /**
   * Unauthorized response
   * @param {string} message - Unauthorized message
   * @returns {object} Formatted unauthorized response
   */
  unauthorized: (message = 'Unauthorized access') => ({
    success: false,
    message,
    data: null,
    statusCode: 401
  }),

  /**
   * Validation error response
   * @param {string} message - Validation error message
   * @param {any} errors - Validation errors
   * @returns {object} Formatted validation error response
   */
  validationError: (message = 'Validation failed', errors = null) => ({
    success: false,
    message,
    data: errors,
    statusCode: 400
  })
};

module.exports = apiResponse;