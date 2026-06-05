import asyncHandler from 'express-async-handler';
import * as adminService from '../services/adminService.js';

/**
 * Admin Controller
 * Handles HTTP requests for admin operations
 */

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Dashboard stats retrieved successfully',
    data: { stats },
    timestamp: new Date().toISOString()
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;
  const users = await adminService.getAllUsers(
    parseInt(page),
    parseInt(limit),
    search,
    role
  );

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully',
    data: users,
    timestamp: new Date().toISOString()
  });
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await adminService.getUserById(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User retrieved successfully',
    data: { user },
    timestamp: new Date().toISOString()
  });
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await adminService.updateUserRole(userId, role);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User role updated successfully',
    data: { user },
    timestamp: new Date().toISOString()
  });
});

export const suspendUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await adminService.suspendUser(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User suspended successfully',
    data: { user },
    timestamp: new Date().toISOString()
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  await adminService.deleteUser(userId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User deleted successfully',
    timestamp: new Date().toISOString()
  });
});
