import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for product operations
 */

export const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be 3-100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be 2-50 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports & Outdoors',
      'Books',
      'Toys & Games',
      'Health & Beauty',
      'Automotive',
      'Food & Groceries',
      'Other'
    ])
    .withMessage('Invalid category selected'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0, max: 999999 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
    .custom((value) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((image, index) => {
          if (typeof image !== 'string' || !image.trim()) {
            throw new Error(`Image ${index + 1} must be a valid URL string`);
          }
        });
      }
      return true;
    })
];

export const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be 3-100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),

  body('brand')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be 2-50 characters'),

  body('category')
    .optional()
    .trim()
    .isIn([
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports & Outdoors',
      'Books',
      'Toys & Games',
      'Health & Beauty',
      'Automotive',
      'Food & Groceries',
      'Other'
    ])
    .withMessage('Invalid category selected'),

  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),

  body('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one product image is required')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('At least one image URL is required');
      }
      value.forEach((image, index) => {
        if (typeof image !== 'string' || !image.trim()) {
          throw new Error(`Image ${index + 1} must be a valid URL string`);
        }
      });
      return true;
    }),

  body('ratings')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Ratings must be between 0 and 5')
];

/**
 * Middleware to handle validation errors
 */
export const handleProductValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg
      })),
      timestamp: new Date().toISOString()
    });
  }
  next();
};
