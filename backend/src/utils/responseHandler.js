/**
 * Centralized Response Handler
 * Provides consistent response formatting across the API
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response data
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} error - Error details (optional)
 */
export const sendError = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Array} data - Data array
 * @param {number} total - Total items count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 */
export const sendPaginated = (
  res,
  statusCode,
  message,
  data,
  total,
  page,
  limit
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Created resource data
 */
export const sendCreated = (res, message, data) => {
  sendSuccess(res, 201, message, data);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendNotFound = (res, message) => {
  sendError(res, 404, message);
};

/**
 * Send bad request response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendBadRequest = (res, message) => {
  sendError(res, 400, message);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
  sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendForbidden = (res, message = 'Access denied') => {
  sendError(res, 403, message);
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendConflict = (res, message) => {
  sendError(res, 409, message);
};

/**
 * Send internal server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendInternalServerError = (
  res,
  message = 'Internal server error'
) => {
  sendError(res, 500, message);
};
