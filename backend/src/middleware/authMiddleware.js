import asyncHandler from 'express-async-handler';
import { verifyToken, extractTokenFromHeader } from '../utils/generateToken.js';
import { AppError } from './errorMiddleware.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 * Extracts and validates token from Authorization header
 * Attaches user info to request object
 */

/**
 * Protect Route Middleware
 * Verifies JWT token and checks if user is authenticated
 * Must be placed before controllers that need authentication
 *
 * Usage:
 * router.get('/profile', protect, getProfile);
 *
 * @throws {AppError} - If token missing, invalid, or expired
 */
export const protect = asyncHandler(async (req, res, next) => {
  // Step 1: Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  // Step 2: Check if token exists
  if (!token) {
    throw new AppError('No authentication token provided', 401);
  }

  // Step 3: Verify token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    // Handle token errors specifically
    if (error.message === 'Token has expired') {
      throw new AppError('Your session has expired. Please login again', 401);
    } else if (error.message === 'Invalid token') {
      throw new AppError('Invalid authentication token', 401);
    }
    throw new AppError('Authentication failed', 401);
  }

  // Step 4: Attach user info to request
  // Decoded token contains userId and email
  req.user = {
    userId: decoded.userId,
    _id: decoded.userId,
    email: decoded.email,
  };

  // Step 5: Call next middleware
  next();
});

/**
 * Require Admin Role Middleware
 * Checks if authenticated user has admin role
 * Must be used AFTER protect middleware
 *
 * Usage:
 * router.delete('/users/:id', protect, requireAdmin, deleteUser);
 *
 * @throws {AppError} - If user is not admin
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  // Step 1: Check if user is attached to request
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  // Step 2: Get user ID from request
  const userId = req.user.userId;

  // Step 3: Fetch user from database and check role
  const user = await User.findById(userId);

  // Step 4: Check if user exists
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Step 5: Check if user has admin role
  if (user.role !== 'admin') {
    throw new AppError('Access denied. Admin privileges required', 403);
  }

  // Step 6: Continue to next middleware
  next();
});

/**
 * Optional Auth Middleware
 * Verifies token if provided, but doesn't require it
 * Attaches user info if valid token found
 * Continues to next handler even if token missing/invalid
 *
 * Usage:
 * router.get('/products', optionalAuth, getProducts);
 * // User info available if authenticated, but not required
 *
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  // Step 1: Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  // Step 2: If no token, just continue
  if (!token) {
    return next();
  }

  // Step 3: Try to verify token if provided
  try {
    const decoded = verifyToken(token);

    // Attach user info if token is valid
    req.user = {
      userId: decoded.userId,
      _id: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    // If token invalid, just log and continue (optional auth)
    console.warn('Optional auth token verification failed:', error.message);
  }

  // Step 4: Continue regardless of token validity
  next();
});

/**
 * Check Authentication Status
 * Utility to check if user is authenticated
 * Used in controllers to conditionally apply logic
 *
 * @param {Object} req - Express request object
 * @returns {Boolean} - True if user is authenticated
 */
export const isAuthenticated = (req) => {
  return req.user && req.user.userId;
};

/**
 * Get Current User
 * Utility to safely get current user from request
 * Returns user object or null if not authenticated
 *
 * @param {Object} req - Express request object
 * @returns {Object|null} - User object or null
 */
export const getCurrentUser = (req) => {
  return req.user || null;
};
