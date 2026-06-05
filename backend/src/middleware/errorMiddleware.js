/**
 * Error Handling Middleware
 * Centralized error handler for all application errors
 * Catches errors from routes and other middleware
 * Formats responses consistently and logs errors
 */

/**
 * Custom Error Class
 * Extends Error with additional properties for consistent error handling
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error Handler Middleware
 * Express error handler with signature (err, req, res, next)
 * Must have 4 parameters to be recognized as error middleware
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code
  const statusCode = err.statusCode || 500;

  // Determine error message
  let message = err.message || 'Internal Server Error';

  // Log error details
  console.error(`
╔════════════════════════════════════════╗
║           ERROR OCCURRED               ║
╠════════════════════════════════════════╣
║ Status Code: ${statusCode}
║ Message: ${message}
║ Path: ${req.method} ${req.path}
║ Timestamp: ${new Date().toISOString()}
║ Stack: ${err.stack?.split('\n')[1]?.trim() || 'N/A'}
╚════════════════════════════════════════╝
  `);

  // Handle specific error types
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      details: messages,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: `Duplicate value for field: ${field}`,
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose cast error (invalid ID format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid resource ID format',
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid authentication token',
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // JWT expiration error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Authentication token has expired',
      details: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Generic error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    // Include details in development
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
        fullMessage: err.message,
        // Include mongoose error details if present
        ...(err.errors && { mongooseErrors: err.errors }),
        ...(err.keyPattern && { duplicateKey: err.keyPattern }),
      },
    }),
  });
};

export default errorHandler;
