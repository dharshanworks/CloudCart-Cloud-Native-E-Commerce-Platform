import express from 'express';
import {
  register,
  login,
  getProfile,
  logout,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * Authentication Routes
 * Defines all authentication-related API endpoints
 * Chains validation, authentication, and controller middleware
 */

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user account
 * 
 * Middleware chain:
 * 1. validateRegister - Validates input
 * 2. handleValidationErrors - Checks for validation errors
 * 3. register - Controller that creates user
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * Response (201):
 * {
 *   "success": true,
 *   "statusCode": 201,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "createdAt": "...",
 *       ...
 *     },
 *     "token": "eyJhbGc...",
 *     "expiresAt": "..."
 *   },
 *   "timestamp": "..."
 * }
 */
router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  register
);

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * 
 * Middleware chain:
 * 1. validateLogin - Validates email and password format
 * 2. handleValidationErrors - Checks for validation errors
 * 3. login - Controller that authenticates user
 * 
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "SecurePass123"
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "lastLogin": "...",
 *       ...
 *     },
 *     "token": "eyJhbGc...",
 *     "expiresAt": "..."
 *   },
 *   "timestamp": "..."
 * }
 * 
 * Error (401):
 * {
 *   "success": false,
 *   "statusCode": 401,
 *   "message": "Invalid email or password",
 *   "timestamp": "..."
 * }
 */
router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  login
);

/**
 * GET /api/auth/profile
 * Get current authenticated user's profile
 * 
 * Middleware chain:
 * 1. protect - Verifies JWT token
 * 2. getProfile - Controller that returns user profile
 * 
 * Headers required:
 * {
 *   "Authorization": "Bearer <your-jwt-token>"
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "User profile retrieved successfully",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       ...
 *     }
 *   },
 *   "timestamp": "..."
 * }
 * 
 * Error (401):
 * {
 *   "success": false,
 *   "statusCode": 401,
 *   "message": "No authentication token provided",
 *   "timestamp": "..."
 * }
 */
router.get(
  '/profile',
  protect,
  getProfile
);

/**
 * POST /api/auth/logout
 * Logout current user
 * 
 * Middleware chain:
 * 1. protect - Verifies JWT token
 * 2. logout - Controller that logs out user
 * 
 * Note: Actual token deletion happens on client side
 * This endpoint is for server-side cleanup/logging
 * 
 * Headers required:
 * {
 *   "Authorization": "Bearer <your-jwt-token>"
 * }
 * 
 * Response (200):
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Logout successful. Please delete your token from client storage.",
 *   "timestamp": "..."
 * }
 */
router.post(
  '/logout',
  protect,
  logout
);

export default router;
