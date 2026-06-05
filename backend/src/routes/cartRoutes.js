import express from 'express';
import * as cartController from '../controllers/cartController.js';
import * as orderValidator from '../validators/orderValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/cart
 * @desc    Add product to cart
 * @access  Private
 * @request {Object} body
 *   @param {string} productId - Product ID (MongoDB ObjectId)
 *   @param {number} quantity - Quantity (1+)
 * @response {200} {success, message, data: {cart}}
 * @error {400} Validation failed / Insufficient stock
 * @error {401} Unauthorized
 * @error {404} Product not found
 */
router.post(
  '/',
  protect,
  orderValidator.validateAddToCart,
  orderValidator.handleValidationErrors,
  cartController.addToCart
);

/**
 * @route   GET /api/cart
 * @desc    Get logged-in user's cart
 * @access  Private
 * @response {200} {success, message, data: {cart}}
 * @error {401} Unauthorized
 */
router.get('/', protect, cartController.getCart);

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update product quantity in cart
 * @access  Private
 * @param {string} productId - Product ID
 * @request {Object} body
 *   @param {number} quantity - New quantity (1+)
 * @response {200} {success, message, data: {cart}}
 * @error {400} Validation failed / Insufficient stock
 * @error {401} Unauthorized
 * @error {404} Product not in cart
 */
router.put(
  '/:productId',
  protect,
  orderValidator.validateUpdateCartQuantity,
  orderValidator.handleValidationErrors,
  cartController.updateCartQuantity
);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove product from cart
 * @access  Private
 * @param {string} productId - Product ID
 * @response {200} {success, message, data: {cart}}
 * @error {401} Unauthorized
 * @error {404} Product not in cart
 */
router.delete('/:productId', protect, cartController.removeFromCart);

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Private
 * @response {200} {success, message}
 * @error {401} Unauthorized
 */
router.delete('/', protect, cartController.clearCart);

export default router;
