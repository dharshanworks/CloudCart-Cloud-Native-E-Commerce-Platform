import asyncHandler from 'express-async-handler';
import * as cartService from '../services/cartService.js';

/**
 * Cart Controller
 * Handles HTTP requests for cart operations
 */

export const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(userId, productId, parseInt(quantity));

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product added to cart successfully',
    data: { cart },
    timestamp: new Date().toISOString()
  });
});

export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartService.getCart(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cart retrieved successfully',
    data: { cart },
    timestamp: new Date().toISOString()
  });
});

export const updateCartQuantity = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await cartService.updateCartQuantity(userId, productId, parseInt(quantity));

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cart quantity updated successfully',
    data: { cart },
    timestamp: new Date().toISOString()
  });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await cartService.removeFromCart(userId, productId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product removed from cart successfully',
    data: { cart },
    timestamp: new Date().toISOString()
  });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  await cartService.clearCart(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cart cleared successfully',
    timestamp: new Date().toISOString()
  });
});
