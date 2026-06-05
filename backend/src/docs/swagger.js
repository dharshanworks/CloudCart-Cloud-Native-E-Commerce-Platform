import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Swagger / OpenAPI Configuration
 * Generates interactive API documentation from JSDoc comments
 * Served at /api/docs (UI) and /api/docs.json (raw spec)
 */

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CloudCart API',
      version: '1.0.0',
      description: `
CloudCart E-Commerce Backend API documentation.

## Authentication
Most endpoints require a Bearer JWT token in the \`Authorization\` header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

Token is returned by \`/api/auth/register\` and \`/api/auth/login\`.
      `,
      contact: {
        name: 'CloudCart Team',
        email: 'support@cloudcart.dev',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            phone: { type: 'string', nullable: true, example: '+1-555-123-4567' },
            address: {
              type: 'object',
              nullable: true,
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                postalCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            isActive: { type: 'boolean', example: true },
            isEmailVerified: { type: 'boolean', example: false },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Wireless Headphones' },
            description: { type: 'string' },
            brand: { type: 'string', example: 'AudioPro' },
            category: {
              type: 'string',
              enum: [
                'Electronics',
                'Fashion',
                'Home & Garden',
                'Sports & Outdoors',
                'Books',
                'Toys & Games',
                'Health & Beauty',
                'Automotive',
                'Food & Groceries',
                'Other',
              ],
            },
            price: { type: 'number', example: 199.99 },
            stock: { type: 'integer', example: 45 },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/img1.jpg'],
            },
            primaryImage: { type: 'string', nullable: true },
            ratings: { type: 'number', example: 4.5 },
            numReviews: { type: 'integer', example: 12 },
            isActive: { type: 'boolean', example: true },
            createdBy: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            product: { $ref: '#/components/schemas/Product' },
            quantity: { type: 'integer', example: 2 },
            price: { type: 'number', example: 199.99 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            totalPrice: { type: 'number', example: 399.98 },
            totalItems: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: { type: 'string' },
            productName: { type: 'string' },
            quantity: { type: 'integer' },
            price: { type: 'number' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
              },
            },
            orderNumber: { type: 'string', example: 'ORD-123456-7' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            shippingDetails: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                address: {
                  type: 'object',
                  properties: {
                    street: { type: 'string' },
                    city: { type: 'string' },
                    state: { type: 'string' },
                    postalCode: { type: 'string' },
                    country: { type: 'string' },
                  },
                },
              },
            },
            paymentDetails: {
              type: 'object',
              properties: {
                method: {
                  type: 'string',
                  enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'],
                },
                status: { type: 'string', enum: ['Pending', 'Completed', 'Failed'] },
                transactionId: { type: 'string' },
              },
            },
            pricing: {
              type: 'object',
              properties: {
                subtotal: { type: 'number' },
                shippingCost: { type: 'number' },
                tax: { type: 'number' },
                total: { type: 'number' },
              },
            },
            orderStatus: {
              type: 'string',
              enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            },
            trackingNumber: { type: 'string', nullable: true },
            estimatedDelivery: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'integer' },
            totalProducts: { type: 'integer' },
            totalOrders: { type: 'integer' },
            completedOrders: { type: 'integer' },
            totalRevenue: { type: 'number' },
            pendingOrders: { type: 'integer' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer' },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & user profile' },
      { name: 'Products', description: 'Product catalog, search, filters' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Orders', description: 'Order placement & tracking' },
      { name: 'Admin', description: 'Admin-only management endpoints' },
    ],
    paths: {
      '/api/health': {
        get: {
          tags: ['Auth'],
          summary: 'Health check',
          description: 'Liveness probe — confirms the API is up',
          responses: {
            200: {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', minLength: 2, maxLength: 100 },
                    email: { type: 'string', format: 'email' },
                    password: {
                      type: 'string',
                      minLength: 6,
                      maxLength: 128,
                      description: 'Must contain upper, lower, and a number',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User created',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string' },
                              expiresAt: { type: 'string', format: 'date-time' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string' },
                              expiresAt: { type: 'string', format: 'date-time' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            403: { description: 'Account locked', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profile retrieved',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: { user: { $ref: '#/components/schemas/User' } },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout (client should discard token)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logged out', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/products/categories/list': {
        get: {
          tags: ['Products'],
          summary: 'List all product categories',
          responses: {
            200: { description: 'Categories list', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          },
        },
      },
      '/api/products/upload/images': {
        post: {
          tags: ['Products'],
          summary: 'Upload product images (admin)',
          description: 'Multipart upload, returns URLs to use when creating a product',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    images: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      maxItems: 5,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Images uploaded', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Upload error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'List products (search/filter/sort/paginate)',
          parameters: [
            { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Match name, description, or brand' },
            { in: 'query', name: 'category', schema: { type: 'string' } },
            { in: 'query', name: 'price[gte]', schema: { type: 'number' } },
            { in: 'query', name: 'price[lte]', schema: { type: 'number' } },
            { in: 'query', name: 'sort', schema: { type: 'string', example: '-price,name' } },
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10, maximum: 100 } },
          ],
          responses: {
            200: {
              description: 'Products retrieved',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                              total: { type: 'integer' },
                              page: { type: 'integer' },
                              limit: { type: 'integer' },
                              totalPages: { type: 'integer' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Create a product (admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'description', 'brand', 'category', 'price', 'stock', 'images'],
                  properties: {
                    name: { type: 'string', minLength: 3, maxLength: 100 },
                    description: { type: 'string', minLength: 10, maxLength: 2000 },
                    brand: { type: 'string', minLength: 2, maxLength: 50 },
                    category: { type: 'string' },
                    price: { type: 'number', minimum: 0, maximum: 999999 },
                    stock: { type: 'integer', minimum: 0 },
                    images: { type: 'array', items: { type: 'string' }, minItems: 1 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Product created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Duplicate name+brand', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/products/search': {
        get: {
          tags: ['Products'],
          summary: 'Search products',
          parameters: [
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Search results', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/products/category/{category}': {
        get: {
          tags: ['Products'],
          summary: 'Filter products by category',
          parameters: [
            { in: 'path', name: 'category', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'page', schema: { type: 'integer' } },
            { in: 'query', name: 'limit', schema: { type: 'integer' } },
          ],
          responses: { 200: { description: 'Products in category', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get a single product',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Product retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        put: {
          tags: ['Products'],
          summary: 'Update a product (admin owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    brand: { type: 'string' },
                    category: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'integer' },
                    images: { type: 'array', items: { type: 'string' } },
                    ratings: { type: 'number', minimum: 0, maximum: 5 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            403: { description: 'Not product owner', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Products'],
          summary: 'Soft-delete a product (admin owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            403: { description: 'Not product owner', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Get the current user\u2019s cart',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Cart retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
        post: {
          tags: ['Cart'],
          summary: 'Add item to cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string' },
                    quantity: { type: 'integer', minimum: 1 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Added', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Insufficient stock', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Product not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Cart'],
          summary: 'Clear the entire cart',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Cleared', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/cart/{productId}': {
        put: {
          tags: ['Cart'],
          summary: 'Update item quantity in cart',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['quantity'],
                  properties: { quantity: { type: 'integer', minimum: 1 } },
                },
              },
            },
          },
          responses: { 200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
        delete: {
          tags: ['Cart'],
          summary: 'Remove an item from cart',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get all orders (admin)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'All orders', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
        post: {
          tags: ['Orders'],
          summary: 'Create order from current cart',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['shippingDetails', 'paymentDetails'],
                  properties: {
                    shippingDetails: {
                      type: 'object',
                      required: ['name', 'email', 'phone', 'address'],
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        address: {
                          type: 'object',
                          required: ['street', 'city', 'state', 'postalCode', 'country'],
                          properties: {
                            street: { type: 'string' },
                            city: { type: 'string' },
                            state: { type: 'string' },
                            postalCode: { type: 'string' },
                            country: { type: 'string' },
                          },
                        },
                      },
                    },
                    paymentDetails: {
                      type: 'object',
                      required: ['method'],
                      properties: {
                        method: { type: 'string', enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'] },
                        transactionId: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Empty cart / validation', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/orders/my-orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get the current user\u2019s orders',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User orders', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/orders/{id}': {
        get: {
          tags: ['Orders'],
          summary: 'Get a single order (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Order retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            403: { description: 'Not order owner', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
        delete: {
          tags: ['Orders'],
          summary: 'Cancel a pending/processing order (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Cancelled', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Cannot cancel this status', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/orders/{id}/status': {
        put: {
          tags: ['Orders'],
          summary: 'Update order status (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['orderStatus'],
                  properties: {
                    orderStatus: { type: 'string', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            400: { description: 'Invalid status transition', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Dashboard stats (admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Stats retrieved',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: { stats: { $ref: '#/components/schemas/DashboardStats' } },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'List all users (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'role', schema: { type: 'string', enum: ['user', 'admin', 'all'] } },
          ],
          responses: { 200: { description: 'Users retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/admin/users/{userId}': {
        get: {
          tags: ['Admin'],
          summary: 'Get a user by id (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User retrieved', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
        delete: {
          tags: ['Admin'],
          summary: 'Delete a user (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/admin/users/{userId}/role': {
        put: {
          tags: ['Admin'],
          summary: 'Update a user\u2019s role (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['role'],
                  properties: { role: { type: 'string', enum: ['user', 'admin'] } },
                },
              },
            },
          },
          responses: { 200: { description: 'Role updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
      '/api/admin/users/{userId}/suspend': {
        put: {
          tags: ['Admin'],
          summary: 'Suspend a user (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User suspended', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } } },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Mount Swagger UI + raw spec JSON
 * @param {import('express').Express} app - Express application instance
 */
export const setupSwagger = (app) => {
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'CloudCart API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
      },
    })
  );
};

export default swaggerSpec;
