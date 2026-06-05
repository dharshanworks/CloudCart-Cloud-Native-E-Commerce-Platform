import asyncHandler from 'express-async-handler';
import {
  registerUser,
  loginUser,
  getUserById,
  updateLastLogin,
} from '../services/authService.js';
import { AppError } from '../middleware/errorMiddleware.js';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 * Delegates business logic to services
 * Returns formatted JSON responses
 */

/**
 * Register Controller
 * POST /api/auth/register
 * Creates new user account
 * Returns user data and JWT token
 *
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 *
 * Response: 201 Created
 * {
 *   "success": true,
 *   "statusCode": 201,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": {...},
 *     "token": "eyJhbGc...",
 *     "expiresAt": "2024-06-04T15:55:00Z"
 *   },
 *   "timestamp": "2024-05-28T15:55:00Z"
 * }
 */
export const register = asyncHandler(async (req, res, next) => {
  // Destructure request body
  const { name, email, password } = req.body;

  // Call registration service
  try {
    const result = await registerUser({
      name,
      email,
      password,
    });

    // Return success response
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Re-throw to be caught by error middleware
    throw error;
  }
});

/**
 * Login Controller
 * POST /api/auth/login
 * Authenticates user with email and password
 * Returns user data and JWT token
 *
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {...},
 *     "token": "eyJhbGc...",
 *     "expiresAt": "2024-06-04T15:55:00Z"
 *   },
 *   "timestamp": "2024-05-28T15:55:00Z"
 * }
 */
export const login = asyncHandler(async (req, res, next) => {
  // Destructure request body
  const { email, password } = req.body;

  // Call login service
  const result = await loginUser({
    email,
    password,
  });

  // Update last login (fire and forget)
  updateLastLogin(result.user._id);

  // Return success response
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Login successful',
    data: result,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get Profile Controller
 * GET /api/auth/profile
 * Returns current authenticated user's profile
 * Requires valid JWT token in Authorization header
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "User profile retrieved successfully",
 *   "data": {
 *     "user": {...}
 *   },
 *   "timestamp": "2024-05-28T15:55:00Z"
 * }
 */
export const getProfile = asyncHandler(async (req, res, next) => {
  // Get user ID from request (set by auth middleware)
  const userId = req.user.userId;

  // Validate user ID exists
  if (!userId) {
    throw new AppError('User ID not found in request', 400);
  }

  // Call get user service
  const user = await getUserById(userId);

  // Return success response
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: {
      user,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Logout Controller
 * POST /api/auth/logout
 * Logs out current user
 * Note: JWT logout is handled client-side (token deletion)
 * This endpoint is for cleanup/logging purposes
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Logout successful",
 *   "timestamp": "2024-05-28T15:55:00Z"
 * }
 */
export const logout = asyncHandler(async (req, res, next) => {
  // Get user ID for logging
  const userId = req.user?.userId;

  // Log logout event
  if (userId) {
    console.log(`✅ User logged out: ${userId}`);
  }

  // Return success response
  // Note: Client should delete token from localStorage/sessionStorage
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Logout successful. Please delete your token from client storage.',
    timestamp: new Date().toISOString(),
  });
});
