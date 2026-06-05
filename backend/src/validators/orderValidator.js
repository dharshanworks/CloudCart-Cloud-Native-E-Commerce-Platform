import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for cart and order operations
 */

export const validateAddToCart = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

export const validateUpdateCartQuantity = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

export const validateCreateOrder = [
  body('shippingDetails')
    .notEmpty()
    .withMessage('Shipping details are required'),

  body('shippingDetails.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),

  body('shippingDetails.email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),

  body('shippingDetails.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[0-9\s\-\+\(\)]{10,}$/)
    .withMessage('Invalid phone number'),

  body('shippingDetails.address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be 5-100 characters'),

  body('shippingDetails.address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be 2-50 characters'),

  body('shippingDetails.address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be 2-50 characters'),

  body('shippingDetails.address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .matches(/^[0-9a-zA-Z\s\-]{3,20}$/)
    .withMessage('Invalid postal code format'),

  body('shippingDetails.address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be 2-50 characters'),

  body('paymentDetails.method')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'])
    .withMessage('Invalid payment method'),

  body('paymentDetails.transactionId')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Transaction ID must be at least 5 characters')
];

export const validateUpdateOrderStatus = [
  body('orderStatus')
    .trim()
    .notEmpty()
    .withMessage('Order status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status')
];

export const validateCancelOrder = [
  // OrderId is in params, validated implicitly in controller
  // No additional body validation needed for cancel operation
];

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
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
