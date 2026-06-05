/**
 * Application Constants
 * Centralized configuration values used across the backend
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  CART_EMPTY: 'Cart is empty',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  UNAUTHORIZED: 'Not authorized to perform this action',
  SERVER_ERROR: 'An error occurred on the server',
  INVALID_TOKEN: 'Invalid or expired authentication token',
  NOT_AUTHENTICATED: 'You must be logged in',
};

// Product Categories (must match Product model enum)
export const PRODUCT_CATEGORIES = [
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
];

// Order Statuses
export const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

// Payment Methods
export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'PayPal',
  'Stripe',
  'Other',
];

// Payment Status
export const PAYMENT_STATUS = [
  'Pending',
  'Completed',
  'Failed',
  'Refunded',
];

// User Roles
export const USER_ROLES = ['user', 'admin'];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

// Pricing & Shipping
export const PRICING = {
  DEFAULT_TAX_RATE: 0.08, // 8%
  DEFAULT_SHIPPING_COST: 10.00,
  FREE_SHIPPING_THRESHOLD: 100.00, // Free shipping over $100
};

// Token Expiry
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '7d', // 7 days
  REFRESH_TOKEN: '30d', // 30 days
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
};

// API Paths
export const API_PATHS = {
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  ADMIN: '/api/admin',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESSFUL: 'Login successful',
  REGISTER_SUCCESSFUL: 'Registration successful',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  ORDER_UPDATED: 'Order updated successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  CART_UPDATED: 'Cart updated successfully',
};
