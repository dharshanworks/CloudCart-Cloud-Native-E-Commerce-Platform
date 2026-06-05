import express from 'express';
import * as productController from '../controllers/productController.js';
import * as productValidator from '../validators/productValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../config/multer.js';
import { handleImageUploadError, convertImagePaths } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * GET ALL CATEGORIES
 * IMPORTANT: Must come before '/:id'
 */
router.get('/categories/list', productController.getCategories);

/**
 * UPLOAD PRODUCT IMAGES (without creating product)
 * Allows frontend to upload images first, then create product with image URLs
 */
router.post(
  '/upload/images',
  protect,
  uploadMultiple,
  handleImageUploadError,
  convertImagePaths,
  productController.uploadProductImages
);

/**
 * CREATE PRODUCT
 */
router.post(
  '/',
  protect,
  productValidator.validateCreateProduct,
  productValidator.handleProductValidationErrors,
  productController.createProduct
);

/**
 * GET ALL PRODUCTS
 */
router.get('/', productController.getAllProducts);

/**
 * SEARCH PRODUCTS
 */
router.get('/search', productController.searchProducts);

/**
 * GET PRODUCTS BY CATEGORY
 */
router.get(
  '/category/:category',
  productController.filterProductsByCategory
);

/**
 * GET SINGLE PRODUCT
 * MUST BE AFTER ALL STATIC ROUTES
 */
router.get('/:id', productController.getProductById);

/**
 * UPDATE PRODUCT
 */
router.put(
  '/:id',
  protect,
  productValidator.validateUpdateProduct,
  productValidator.handleProductValidationErrors,
  productController.updateProduct
);

/**
 * DELETE PRODUCT
 */
router.delete(
  '/:id',
  protect,
  productController.deleteProduct
);

export default router;