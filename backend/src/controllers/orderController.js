import asyncHandler from 'express-async-handler';
import * as orderService from '../services/orderService.js';

/**
 * Order Controller
 * Handles HTTP requests for order operations
 */

export const createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const order = await orderService.createOrder(userId, req.body);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Order created successfully',
    data: { order },
    timestamp: new Date().toISOString()
  });
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  const order = await orderService.getOrder(orderId, userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Order retrieved successfully',
    data: { order },
    timestamp: new Date().toISOString()
  });
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await orderService.getUserOrders(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User orders retrieved successfully',
    data: { orders, total: orders.length },
    timestamp: new Date().toISOString()
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'All orders retrieved successfully',
    data: { orders, total: orders.length },
    timestamp: new Date().toISOString()
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const { orderStatus } = req.body;
  const order = await orderService.updateOrderStatus(orderId, orderStatus);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Order status updated successfully',
    data: { order },
    timestamp: new Date().toISOString()
  });
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const orderId = req.params.id;
  const order = await orderService.cancelOrder(orderId, userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Order cancelled successfully',
    data: { order },
    timestamp: new Date().toISOString()
  });
});
