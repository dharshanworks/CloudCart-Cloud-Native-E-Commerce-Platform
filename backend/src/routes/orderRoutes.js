import express from 'express';
import * as orderController from '../controllers/orderController.js';
import * as orderValidator from '../validators/orderValidator.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/orders
 * @desc    Create order from cart
 * @access  Private
 * @request {Object} body
 *   @param {Object} shippingDetails - Shipping information
 *     @param {string} name - Recipient name (2-100 chars)
 *     @param {string} email - Email address
 *     @param {string} phone - Phone number
 *     @param {Object} address - Address object
 *       @param {string} street - Street address (5-100 chars)
 *       @param {string} city - City (2-50 chars)
 *       @param {string} state - State (2-50 chars)
 *       @param {string} postalCode - Postal code
 *       @param {string} country - Country (2-50 chars)
 *   @param {Object} paymentDetails - Payment information
 *     @param {string} method - Payment method (Credit Card, Debit Card, PayPal, Stripe, Other)
 *     @param {string} transactionId - Transaction ID (optional, 5+ chars)
 * @response {201} {success, message, data: {order}}
 * @error {400} Validation failed / Empty cart / Insufficient stock
 * @error {401} Unauthorized
 */
router.post(
  '/',
  orderValidator.validateCreateOrder,
  orderValidator.handleValidationErrors,
  orderController.createOrder
);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged-in user's orders
 * @access  Private
 * @response {200} {success, message, data: {orders[], total}}
 * @error {401} Unauthorized
 */
router.get('/my-orders', orderController.getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private (Own orders only)
 * @param {string} id - Order ID
 * @response {200} {success, message, data: {order}}
 * @error {401} Unauthorized
 * @error {403} Not order owner
 * @error {404} Order not found
 */
router.get('/:id', orderController.getOrder);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private (Admin only)
 * @param {string} id - Order ID
 * @request {Object} body
 *   @param {string} orderStatus - New status (Pending, Processing, Shipped, Delivered, Cancelled)
 * @response {200} {success, message, data: {order}}
 * @error {400} Validation failed / Invalid status transition
 * @error {401} Unauthorized
 * @error {404} Order not found
 */
router.put(
  '/:id/status',
  requireAdmin,
  orderValidator.validateUpdateOrderStatus,
  orderValidator.handleValidationErrors,
  orderController.updateOrderStatus
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel order (User can cancel own pending/processing orders)
 * @access  Private
 * @param {string} id - Order ID
 * @response {200} {success, message, data: {order}}
 * @error {401} Unauthorized
 * @error {403} Not order owner
 * @error {404} Order not found
 * @error {400} Cannot cancel this order status
 */
router.delete('/:id', orderController.cancelOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private (Admin only)
 * @response {200} {success, message, data: {orders[], total}}
 * @error {401} Unauthorized
 * @error {403} Admin access required
 */
router.get('/', requireAdmin, orderController.getAllOrders);

export default router;
