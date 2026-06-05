import jwt from 'jsonwebtoken';
import envConfig from '../config/env.js';

/**
 * JWT Token Generation Utility
 * Creates secure JWT tokens for authentication
 * Tokens are signed with secret and include expiry
 */

/**
 * Generate JWT Token
 * Creates a signed JWT token with user information
 * Token expires after specified duration
 *
 * @param {String} userId - User's MongoDB ObjectId
 * @param {String} email - User's email address
 * @returns {Object} - Object containing token and expiry
 */
const generateToken = (userId, email) => {
  // Token payload (claims)
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000), // Issued at
  };

  // Token expiry: 7 days
  const expiresIn = '7d';

  try {
    // Sign token with secret
    const token = jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn,
      algorithm: 'HS256', // HMAC using SHA-256
    });

    // Calculate expiry timestamp
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return {
      token,
      expiresAt,
      expiresIn,
    };
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify JWT Token
 * Validates and decodes a JWT token
 * Returns decoded payload if valid
 *
 * @param {String} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Extract Token from Header
 * Extracts Bearer token from Authorization header
 * Expected format: "Bearer <token>"
 *
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} - Token if found, null otherwise
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  // Check if header starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Extract token (everything after "Bearer ")
  return authHeader.slice(7);
};

/**
 * Decode Token (without verification)
 * Decodes JWT without verifying signature
 * Use only for non-critical data like user ID
 *
 * @param {String} token - JWT token to decode
 * @returns {Object|null} - Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

export {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  decodeToken,
};
