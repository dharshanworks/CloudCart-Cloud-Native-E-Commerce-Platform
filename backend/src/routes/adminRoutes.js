import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, requireAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics (orders, users, revenue, products)
 * @access  Private (Admin only)
 * @response {200} {success, message, data: {stats}}
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination, search, role filter
 * @access  Private (Admin only)
 * @query
 *   @param {number} page - Page number (default: 1)
 *   @param {number} limit - Items per page (default: 10)
 *   @param {string} search - Search by name/email
 *   @param {string} role - Filter by role (admin, user)
 * @response {200} {success, message, data: {users[], total, page, limit}}
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get user details
 * @access  Private (Admin only)
 * @param {string} userId - User ID
 * @response {200} {success, message, data: {user}}
 */
router.get('/users/:userId', adminController.getUserById);

/**
 * @route   PUT /api/admin/users/:userId/role
 * @desc    Update user role
 * @access  Private (Admin only)
 * @param {string} userId - User ID
 * @request {Object} body
 *   @param {string} role - New role (admin or user)
 * @response {200} {success, message, data: {user}}
 */
router.put('/users/:userId/role', adminController.updateUserRole);

/**
 * @route   PUT /api/admin/users/:userId/suspend
 * @desc    Suspend user account
 * @access  Private (Admin only)
 * @param {string} userId - User ID
 * @response {200} {success, message, data: {user}}
 */
router.put('/users/:userId/suspend', adminController.suspendUser);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete user permanently
 * @access  Private (Admin only)
 * @param {string} userId - User ID
 * @response {200} {success, message}
 */
router.delete('/users/:userId', adminController.deleteUser);

export default router;
