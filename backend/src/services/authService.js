import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../middleware/errorMiddleware.js';

/**
 * Authentication Service
 * Handles business logic for registration and login
 * Keeps authentication logic separate from request handling
 */

/**
 * Register User Service
 * Creates new user account with email and password
 * Validates email doesn't already exist
 * Hashes password before storage
 *
 * @param {Object} userData - User data {name, email, password}
 * @returns {Object} - Created user and JWT token
 * @throws {AppError} - If validation fails or email exists
 */
const registerUser = async (userData) => {
   try {
     // Destructure user data
     const { name, email, password } = userData;

     // Step 1: Check if email already exists
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       throw new AppError('Email already registered', 409);
     }

     // Step 2: Create new user
     // Note: Password is automatically hashed by pre-save hook in User model
     const user = new User({
       name,
       email,
       password,
     });

     // Step 3: Save user to database
     try {
       await user.save();
     } catch (saveError) {
       console.error('Database save error:', {
         name: saveError.name,
         message: saveError.message,
         code: saveError.code,
         keyPattern: saveError.keyPattern,
         errors: saveError.errors
       });
       throw saveError;
     }

     // Step 4: Generate JWT token
     try {
       const { token, expiresAt } = generateToken(user._id.toString(), user.email);
       
       // Step 5: Log the action
       console.log(`✅ User registered successfully: ${email}`);

       // Step 6: Return user data (without password) and token
       return {
         user: user.getSafeData(),
         token,
         expiresAt,
       };
     } catch (tokenError) {
       console.error('Token generation error:', {
         message: tokenError.message,
         stack: tokenError.stack
       });
       throw tokenError;
     }
   } catch (error) {
     // Re-throw if already AppError
     if (error instanceof AppError) {
       throw error;
     }

     // Handle Mongoose duplicate key error
     if (error.code === 11000) {
       throw new AppError('Email already registered', 409);
     }

     // Handle Mongoose validation errors
     if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors)
         .map((err) => err.message)
         .join(', ');
       throw new AppError(`Validation Error: ${messages}`, 400);
     }

     // Log unexpected errors with full details
     console.error('Register Error Details:', {
       message: error.message,
       name: error.name,
       code: error.code,
       stack: error.stack
     });
     throw new AppError('Failed to register user', 500);
   }
};

/**
 * Login User Service
 * Authenticates user with email and password
 * Compares provided password with stored hash
 * Returns JWT token on successful authentication
 *
 * @param {Object} credentials - Login credentials {email, password}
 * @returns {Object} - Authenticated user and JWT token
 * @throws {AppError} - If credentials are invalid or user not found
 */
const loginUser = async (credentials) => {
  try {
    // Destructure credentials
    const { email, password } = credentials;

    // Step 1: Check if email and password provided
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Step 2: Find user by email
    // Important: Include password field (normally excluded with select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Step 3: Check if account is locked (brute force protection)
    if (user.isAccountLocked()) {
      const minutesLeft = Math.ceil(
        (user.accountLockedUntil - new Date()) / (1000 * 60)
      );
      throw new AppError(
        `Account is locked. Try again in ${minutesLeft} minutes`,
        403
      );
    }

    // Step 4: Compare password with hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }

      await user.save();
      throw new AppError('Invalid email or password', 401);
    }

    // Step 5: Reset failed login attempts on success
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    user.lastLogin = new Date();

    // Step 6: Save updated user data
    await user.save();

    // Step 7: Generate JWT token
    const { token, expiresAt } = generateToken(user._id.toString(), user.email);

    // Step 8: Log successful login
    console.log(`✅ User logged in successfully: ${email}`);

    // Step 9: Return user data (without password) and token
    return {
      user: user.getSafeData(),
      token,
      expiresAt,
    };
  } catch (error) {
    // Re-throw if already AppError
    if (error instanceof AppError) {
      throw error;
    }

    // Log unexpected errors
    console.error('Login Error:', error.message);
    throw new AppError('Failed to login user', 500);
  }
};

/**
 * Get User by ID Service
 * Retrieves user profile by ID
 * Used in protected routes to get current user
 *
 * @param {String} userId - User's MongoDB ObjectId
 * @returns {Object} - User data (without sensitive fields)
 * @throws {AppError} - If user not found
 */
const getUserById = async (userId) => {
  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Return safe user data
    return user.getSafeData();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error('Get User Error:', error.message);
    throw new AppError('Failed to fetch user', 500);
  }
};

/**
 * Update Last Login Service
 * Updates user's last login timestamp
 * Used for analytics and security auditing
 *
 * @param {String} userId - User's MongoDB ObjectId
 */
const updateLastLogin = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  } catch (error) {
    // Don't throw error for audit operations
    console.error('Update Last Login Error:', error.message);
  }
};

export {
  registerUser,
  loginUser,
  getUserById,
  updateLastLogin,
};
