import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';
import envConfig from './config/env.js';
import errorHandler from './middleware/errorMiddleware.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { setupSwagger } from './docs/swagger.js';
import client from 'prom-client';
import { PRICING } from './utils/constants.js';

/**
 * Express Application Factory
 * Initializes and configures the Express application
 * Registers all middleware and routes
 * Implements production-grade middleware stack
 */

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * PROMETHEUS METRICS
 */
client.collectDefaultMetrics();

/**
 * SECTION 1: TRUST PROXY
 * Configure Express to trust proxy headers from reverse proxies (nginx, load balancers)
 * This is important for getting real client IP in production/Kubernetes
 */
app.set('trust proxy', 1);

/**
 * SECTION 2: SECURITY MIDDLEWARE
 * Helmet.js: Sets HTTP security headers
 * CORS: Enables cross-origin requests
 */
app.use(
  helmet({
    // Configure Helmet options for security
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    frameguard: { action: 'deny' }, // Prevent clickjacking
    xssFilter: true, // Enable XSS protection
  })
);

app.use(
  cors({
    // CORS configuration
    origin: envConfig.isDevelopment ? '*' : process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies in cross-origin requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

/**
 * SECTION 3: PARSING MIDDLEWARE
 * Parse incoming request bodies and cookies
 */
app.use(express.json({ limit: '10mb' })); // JSON payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL-encoded payloads
app.use(cookieParser()); // Parse cookies

/**
 * CSRF Protection
 * Only enable in production for state-changing operations
 */
const csrfProtection = csrf({ cookie: true });
if (envConfig.NODE_ENV === 'production') {
  app.use(csrfProtection);
}

/**
 * SECTION 4: COMPRESSION MIDDLEWARE
 * Compress responses for better performance
 */
app.use(
  compression({
    level: 6, // Compression level (0-11, higher = better compression but slower)
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

/**
 * SECTION 5: LOGGING MIDDLEWARE
 * Morgan: HTTP request logger
 * Shows all incoming requests with details
 */
const morganFormat =
  envConfig.isDevelopment
    ? 'dev' // Colorful, concise format for development
    : 'combined'; // Standard Apache format for production

app.use(morgan(morganFormat));

/**
 * SECTION 5.5: STATIC FILES SERVING
 * Serve uploaded product images
 * Images stored in backend/uploads/products can be accessed via /uploads/products/:filename
 */
const uploadsDir = path.join(__dirname, '../uploads/products');
app.use('/uploads/products', express.static(uploadsDir));

/**
 * SECTION 6: HEALTH CHECK ROUTE
 * Base route to verify API is running
 * Essential for Kubernetes liveness probes
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CloudCart Backend is Running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: envConfig.NODE_ENV,
  });
});

app.get('/api/config/pricing', (req, res) => {
  res.status(200).json({
    success: true,
    data: PRICING
  });
});

/**
 * SECTION 6.5: SWAGGER API DOCUMENTATION
 * Interactive API docs at /api/docs
 * Raw OpenAPI spec at /api/docs.json
 * Only registered when not in test environment
 */
if (envConfig.NODE_ENV !== 'test') {
  setupSwagger(app);
}

/**
 * PROMETHEUS METRICS ENDPOINT
 */
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

/**
 * SECTION 7: RATE LIMITING
 * Apply rate limiting to auth endpoints to prevent brute force attacks
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many login attempts. Please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * SECTION 8: API ROUTES
 * Mount route handlers here
 */
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

/**
 * SECTION 8: 404 NOT FOUND MIDDLEWARE
 * Must be registered AFTER all route handlers
 * Catches all unmatched routes
 */
app.use(notFoundMiddleware);

/**
 * SECTION 9: CENTRALIZED ERROR HANDLER MIDDLEWARE
 * Must be registered LAST, after all other middleware
 * Has 4 parameters (err, req, res, next) - this is required for Express
 */
app.use(errorHandler);

/**
 * SECTION 10: GRACEFUL ERROR HANDLER FOR UNHANDLED REJECTIONS
 * Handles errors from async code that wasn't properly caught
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1); // Exit on uncaught exception
});

export default app;
