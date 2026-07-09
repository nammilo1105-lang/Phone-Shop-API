const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Phone Shop API",
      version: "1.0.0",
      description: "RESTful API documentation for Phone Shop - E-commerce Platform",
      contact: {
        name: "Phone Shop Support",
        email: "support@phoneshop.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development Server",
      },
      {
        url: "http://localhost:3000/api/v3",
        description: "API v3 Base URL",
      },
    ],
    // Security Scheme Definition
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authentication with Bearer token",
        },
      },
      schemas: {
        // User Schema
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", writeOnly: true },
            fullName: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            status: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // Product Schema
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            salePrice: { type: "number" },
            category: { type: "string" },
            brand: { type: "string" },
            image: { type: "string" },
            images: { type: "array", items: { type: "string" } },
            quantity: { type: "number" },
            sold: { type: "number" },
            ratings: { type: "number", minimum: 0, maximum: 5 },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // Order Schema
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: { type: "string" },
                  quantity: { type: "number" },
                  price: { type: "number" },
                },
              },
            },
            totalPrice: { type: "number" },
            shippingAddress: { type: "string" },
            status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // Category Schema
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            icon: { type: "string" },
          },
        },

        // Brand Schema
        Brand: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            logo: { type: "string" },
          },
        },

        // News Schema
        News: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            slug: { type: "string" },
            thumbnail: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            author: { type: "string" },
            viewCount: { type: "number", default: 0 },
            status: { type: "boolean", default: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        NewsInput: {
          type: "object",
          required: ["title", "slug", "shortDescription", "content"],
          properties: {
            title: { type: "string" },
            slug: { type: "string" },
            thumbnail: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            author: { type: "string" },
            status: { type: "boolean", default: true },
          },
        },

        // Error Response
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", default: false },
            message: { type: "string" },
            code: { type: "integer" },
          },
        },
      },
    },
    // Global Security
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints - Register, Login, Refresh Token",
      },
      {
        name: "Product",
        description: "Product management - Get, Create, Update, Delete products",
      },
      {
        name: "Category",
        description: "Category management - Get, Create, Update, Delete categories",
      },
      {
        name: "Brand",
        description: "Brand management - Get, Create, Update, Delete brands",
      },
      {
        name: "Order",
        description: "Order management - Create, View, Update order status",
      },
      {
        name: "Cart",
        description: "Shopping cart - Add, Update, Remove cart items",
      },
      {
        name: "Comment",
        description: "Product comments and reviews",
      },
      {
        name: "News",
        description: "Technology news management",
      },
      {
        name: "User",
        description: "Admin - User management",
      },
      {
        name: "Admin",
        description: "Admin - Dashboard statistics",
      },
      {
        name: "Upload",
        description: "File upload endpoints for images",
      },
    ],
  },
  // Swagger will find all @openapi comments in these files
  apis: [
    path.join(__dirname, "../src/routers/web.js"),
    path.join(__dirname, "../src/apps/routes/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
