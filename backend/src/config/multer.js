import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Multer Configuration
 * Handles file upload configuration for product images
 * Uses local file storage during development
 */

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directories
const uploadsDir = path.join(__dirname, '../../uploads/products');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Storage Configuration
 * Saves files to backend/uploads/products/
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (req, file, callback) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    callback(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

/**
 * File Filter
 * Only allow image files (jpg, jpeg, png, gif, webp)
 */
const fileFilter = (req, file, callback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error(
        `Invalid file type. Allowed formats: ${allowedExts.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Multer Instance
 * Configuration for single and multiple image uploads
 */
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit per file
  }
}).single('image');

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit per file
  }
}).array('images', 5); // Max 5 images per product

/**
 * Export upload directory path for serving static files
 */
export const getUploadsDir = () => uploadsDir;

export default {
  uploadSingle,
  uploadMultiple,
  getUploadsDir
};
