import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment Configuration
 * Centralized configuration management for all environment variables
 * Ensures all required variables are present at startup
 */

const envConfig = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database Configuration
  MONGO_URI: process.env.MONGO_URI,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,

  // Application State
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

/**
 * Validation Function
 * Ensures all critical environment variables are defined
 * Prevents application startup with incomplete configuration
 */
const validateEnv = () => {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

/**
 * Initialize Environment
 * Validates configuration on module load
 */
validateEnv();

export default envConfig;
