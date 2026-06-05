import mongoose from 'mongoose';
import envConfig from './env.js';

/**
 * MongoDB Atlas Connection Manager
 * Handles connection initialization, event listeners, and error handling
 * Provides graceful connection failure and recovery
 */

const connectDB = async () => {
  try {
    // Validate connection URI exists
    if (!envConfig.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Establish connection to MongoDB Atlas
    const connection = await mongoose.connect(envConfig.MONGO_URI, {
      // Connection options for optimal performance
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Socket timeout after 45 seconds
      retryWrites: true, // Enable retry writes for reliability
      w: 'majority', // Write concern: all replicas
    });

    console.log(
      `✅ MongoDB Connected Successfully: ${connection.connection.host}`
    );

    // Handle connection events
    setupConnectionListeners();

    return connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Exit process with error code
  }
};

/**
 * Setup Connection Event Listeners
 * Monitors connection state and handles disconnections
 */
const setupConnectionListeners = () => {
  // On successful connection
  mongoose.connection.on('connected', () => {
    console.log('📊 Mongoose connected to MongoDB Atlas');
  });

  // On disconnection
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose disconnected from MongoDB');
  });

  // On error
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
  });

  // On reconnection attempt
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose reconnected to MongoDB Atlas');
  });
};

export default connectDB;
