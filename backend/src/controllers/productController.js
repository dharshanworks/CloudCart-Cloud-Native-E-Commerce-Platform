import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorMiddleware.js';
import * as productService from '../services/productService.js';

/**
 * Product Controller
 * Handles HTTP requests for product operations
 */

export const uploadProductImages = asyncHandler(async (req, res, next) => {
  // Check if files were uploaded
  if (!req.imagePaths || req.imagePaths.length === 0) {
    throw new AppError('No images uploaded', 400);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Images uploaded successfully',
    data: {
      images: req.imagePaths
    },
    timestamp: new Date().toISOString()
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;
  const product = await productService.createProduct(req.body, adminId);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Product created successfully',
    data: { product },
    timestamp: new Date().toISOString()
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.getAllProducts(req.query);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Products retrieved successfully',
    data: result,
    timestamp: new Date().toISOString()
  });
});

export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product retrieved successfully',
    data: { product },
    timestamp: new Date().toISOString()
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;
  const product = await productService.updateProduct(req.params.id, req.body, adminId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product updated successfully',
    data: { product },
    timestamp: new Date().toISOString()
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const adminId = req.user._id;
  await productService.deleteProduct(req.params.id, adminId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Product deleted successfully',
    timestamp: new Date().toISOString()
  });
});

export const searchProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.searchProducts(req.query);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Search results retrieved successfully',
    data: result,
    timestamp: new Date().toISOString()
  });
});

export const filterProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const result = await productService.filterProductsByCategory(category, req.query);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Filtered products retrieved successfully',
    data: result,
    timestamp: new Date().toISOString()
  });
});

export const getCategories = async (req, res) => {
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Health & Beauty',
    'Automotive',
    'Food & Groceries',
    'Other'
  ];

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Categories retrieved successfully',
    data: {
      categories
    },
    timestamp: new Date().toISOString()
  });
};
