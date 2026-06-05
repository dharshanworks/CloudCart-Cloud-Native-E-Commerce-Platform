import asyncHandler from 'express-async-handler';
import { AppError } from './errorMiddleware.js';

/**
 * Admin Middleware - Alternative to requireAdmin in authMiddleware
 * Can be used if requireAdmin in authMiddleware fails or needs override
 * Checks if authenticated user has admin role
 * Must be used AFTER protect middleware
 *
 * Note: This is a backup implementation. Primary admin check is in authMiddleware.js
 */

export const checkAdminRole = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const userId = req.user.userId;
  const { User } = await import('../models/User.js');
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== 'admin') {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  next();
});
