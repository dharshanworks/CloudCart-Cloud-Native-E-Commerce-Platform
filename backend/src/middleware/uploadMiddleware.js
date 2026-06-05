import { AppError } from './errorMiddleware.js';

/**
 * Image Upload Error Handler Middleware
 * Handles errors from Multer during file uploads
 */
export const handleImageUploadError = (err, req, res, next) => {
  // Multer errors
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'File size too large. Maximum 5MB allowed.',
      timestamp: new Date().toISOString()
    });
  }

  if (err && err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message || 'File upload failed',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

/**
 * Image Path Converter Middleware
 * Converts local file paths to accessible URLs
 */
export const convertImagePaths = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    req.imagePaths = req.files.map(
      (file) => `/uploads/products/${file.filename}`
    );
  } else if (req.file) {
    // Handle single file upload as array for consistency
    req.imagePaths = [`/uploads/products/${req.file.filename}`];
  }

  next();
};
