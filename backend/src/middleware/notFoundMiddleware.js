/**
 * Not Found Middleware (404 Handler)
 * Catches all requests that don't match any defined route
 * Must be registered AFTER all route handlers
 * Throws an error that gets handled by the error middleware
 */

import { AppError } from './errorMiddleware.js';

/**
 * 404 Not Found Handler
 * Catches undefined routes and returns 404 response
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundMiddleware = (req, res, next) => {
  const message = `Cannot ${req.method} ${req.originalUrl}`;
  console.warn(`⚠️  Route Not Found: ${message}`);

  // Pass error to error handler middleware
  next(new AppError(message, 404));
};

export default notFoundMiddleware;
