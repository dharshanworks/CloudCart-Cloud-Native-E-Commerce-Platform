import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

/**
 * User Schema
 * Defines the structure of user documents in MongoDB
 * Includes validation, indexes, and password hashing hooks
 */

const userSchema = new mongoose.Schema(
  {
    /**
     * User's full name
     * Required field
     */
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    /**
     * User's email address
     * Must be unique across all users
     * Used for login and account recovery
     */
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    /**
     * User's password
     * Hashed using bcryptjs before storage
     * Never returned in API responses
     */
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },

    /**
     * User's role (basic, extended in future)
     * Determines authorization level
     */
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    /**
     * User's profile picture URL
     * Optional, for future avatar feature
     */
    profilePicture: {
      type: String,
      default: null,
    },

    /**
     * User's phone number
     * Optional, for order notifications
     */
    phone: {
      type: String,
      default: null,
      match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please provide a valid phone number'],
    },

    /**
     * User's shipping address
     * Embedded object for future order functionality
     */
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    /**
     * Account status
     * Used for soft delete and account management
     */
    isActive: {
      type: Boolean,
      default: true,
    },

    /**
     * Email verification status
     * For future email verification feature
     */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    /**
     * Password reset token
     * Used for forgot password feature
     */
    passwordResetToken: {
      type: String,
      select: false,
    },

    /**
     * Password reset token expiry
     * Token expires after certain time
     */
    passwordResetExpiry: {
      type: Date,
      select: false,
    },

    /**
     * Last login timestamp
     * For security and analytics
     */
    lastLogin: {
      type: Date,
      default: null,
    },

    /**
     * Number of failed login attempts
     * For brute force protection
     */
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    /**
     * Account locked until timestamp
     * For brute force protection
     */
    accountLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    /**
     * Timestamp configuration
     * Automatically adds createdAt and updatedAt fields
     */
    timestamps: true,
  }
);

/**
 * INDEX: Email
 * Create index for email lookups (used in login)
 * Unique constraint ensures no duplicate emails
 */

/**
 * PASSWORD HASHING MIDDLEWARE
 * Hash password before saving to database
 * Only hash if password is modified (new account or password reset)
 */
userSchema.pre('save', async function () {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt
  const salt = await bcryptjs.genSalt(10);

  // Hash password
  this.password = await bcryptjs.hash(this.password, salt);
});

/**
 * INSTANCE METHOD: Compare Password
 * Compare plaintext password with hashed password
 * Used during login verification
 *
 * @param {String} plainPassword - Password entered by user
 * @returns {Boolean} - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcryptjs.compare(plainPassword, this.password);
};

/**
 * INSTANCE METHOD: Get Safe User Data
 * Returns user data without sensitive information
 * Used in API responses
 *
 * @returns {Object} - Safe user object
 */
userSchema.methods.getSafeData = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpiry;
  delete userObject.__v;
  return userObject;
};

/**
 * INSTANCE METHOD: Check if Account is Locked
 * Checks if account is locked due to failed login attempts
 *
 * @returns {Boolean} - True if account is locked
 */
userSchema.methods.isAccountLocked = function () {
  if (this.accountLockedUntil && this.accountLockedUntil > new Date()) {
    return true;
  }
  return false;
};

/**
 * Create User Model
 * Compile schema into model
 */
const User = mongoose.model('User', userSchema);

export default User;
