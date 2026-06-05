import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import envConfig from './config/env.js';
import dns from "dns"

dns.setServers(["1.1.1.1","8.8.8.8"]);

/**
 * Server Initialization
 * Entry point for the Node.js backend application
 * Handles:
 * 1. Database connection
 * 2. HTTP server startup
 * 3. Graceful shutdown
 * 4. Error handling
 */

let server;

/**
 * Start Server
 * Initialize database connection and start HTTP server
 */
const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB Atlas
    console.log('🔗 Connecting to MongoDB Atlas...');
    await connectDB();

    // Step 2: Start HTTP Server
    const PORT = envConfig.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 CloudCart Backend Started         ║
╠════════════════════════════════════════╣
║ ✅ Server Running on Port: ${PORT}
║ ✅ Environment: ${envConfig.NODE_ENV.toUpperCase()}
║ ✅ Database: Connected to MongoDB Atlas
║ ✅ API Health: http://localhost:${PORT}/api/health
╚════════════════════════════════════════╝
      `);
    });

    // Step 3: Handle Server Errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server Error:', error.message);
      }
      process.exit(1);
    });

    // Step 4: Graceful Shutdown Handler
    setupGracefulShutdown();
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

/**
 * Graceful Shutdown Handler
 * Ensures server stops cleanly without data loss
 * Handles SIGTERM and SIGINT signals
 */
const setupGracefulShutdown = () => {
  // Handle process termination signals
  const signals = ['SIGTERM', 'SIGINT'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\n🛑 Received ${signal} signal. Starting graceful shutdown...`);

      // Step 1: Stop accepting new connections
      if (server) {
        server.close(() => {
          console.log('✅ HTTP server closed');
        });
      }

      // Step 2: Close database connection
      try {
        await mongoose.disconnect();
        console.log('✅ MongoDB connection closed');
      } catch (error) {
        console.error('❌ Error closing database:', error.message);
      }

      // Step 3: Exit process
      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    });
  });
};

/**
 * Start the server
 * This function is called when the module is executed directly
 */
startServer();

export default app;
