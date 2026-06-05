import { body, validationResult } from 'express-validator';

/**
 * Authentication Validators
 * Validates input for register and login endpoints
 * Uses express-validator for comprehensive validation
 */

/**
 * Register Validation Rules
 * Validates name, email, and password format
 * Checks for required fields and constraints
 */
export const validateRegister = [
  // Name validation
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters')
    .matches(/^[a-zA-Z\s'-]*$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Password validation
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 128 })
    .withMessage('Password cannot exceed 128 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

/**
 * Login Validation Rules
 * Validates email and password for login
 * Less strict than register (no password format check)
 */
export const validateLogin = [
  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Password validation
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Handle Validation Errors
 * Middleware to check for validation errors
 * Returns 400 if validation fails
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const handleValidationErrors = (req, res, next) => {
  // Get validation errors from request
  const errors = validationResult(req);

  // If errors exist, return 400 response
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }

  // No errors, proceed to next middleware
  next();
};

/**
 * Password Strength Checker
 * Utility function to check password strength
 * Returns strength level: weak, medium, strong
 *
 * @param {String} password - Password to check
 * @returns {Object} - Strength info
 */
export const checkPasswordStrength = (password) => {
  let strength = 0;
  const feedback = [];

  // Check length
  if (password.length >= 8) strength++;
  else feedback.push('Password should be at least 8 characters');

  // Check uppercase
  if (/[A-Z]/.test(password)) strength++;
  else feedback.push('Add uppercase letters for stronger password');

  // Check lowercase
  if (/[a-z]/.test(password)) strength++;
  else feedback.push('Add lowercase letters for stronger password');

  // Check numbers
  if (/[0-9]/.test(password)) strength++;
  else feedback.push('Add numbers for stronger password');

  // Check special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  else feedback.push('Add special characters for stronger password');

  // Determine strength level
  let level = 'weak';
  if (strength >= 3) level = 'medium';
  if (strength >= 4) level = 'strong';

  return {
    level,
    score: strength,
    feedback,
  };
};
