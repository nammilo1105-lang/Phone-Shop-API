const express = require("express");
const router = express.Router();

// middlewares
const { userResult, userValidator } = require("../apps/middlewares/userValidator");
const { loginResult, loginValidator } = require("../apps/middlewares/authValidator");
const { verifyAccessToken, verifyRefreshToken, isAdmin } = require("../apps/middlewares/auth");
const { categoryRules, categoryValidator } = require("../apps/middlewares/categoryValidator");
const { brandRules, brandValidator } = require("../apps/middlewares/brandsValidator");
const { productRules, productValidator } = require("../apps/middlewares/productValidator");
const { uploadMiddleware, setFolder } = require("../apps/middlewares/upload");
const { menuRules, menuValidator } = require("../apps/middlewares/menuValidator");
const { sliderRules, sliderValidator } = require("../apps/middlewares/sliderValidator");
const { settingRules, settingValidator } = require("../apps/middlewares/settingValidator");
const { cartRules, cartValidator } = require("../apps/middlewares/cartValidator");
const { favoriteRules, favoriteValidator } = require("../apps/middlewares/favoriteValidator");
const { verifyUser } = require("../apps/middlewares/orderAuth");
const {createOrderResult, createOrderValidator} = require("../apps/middlewares/orderValidator")
const { newsRules, newsValidator } = require("../apps/middlewares/newsValidator");

// controllers
const authController = require("../apps/controllers/apis/authController");
const categoryController = require("../apps/controllers/apis/categoryController");
const brandController = require("../apps/controllers/apis/brandsController");
const productController = require("../apps/controllers/apis/productController");
const uploadController = require("../apps/controllers/apis/uploadController");
const orderController = require("../apps/controllers/apis/orderController");
const commentController = require("../apps/controllers/apis/commentController");
const menuController = require("../apps/controllers/apis/menuController");
const sliderController = require("../apps/controllers/apis/sliderController");
const settingController = require("../apps/controllers/apis/settingController");
const cartController = require("../apps/controllers/apis/cartController");
const favoriteController = require("../apps/controllers/apis/favoriteController");
const homeController = require("../apps/controllers/apis/homeController");
const searchController = require("../apps/controllers/apis/searchController");
const userController = require("../apps/controllers/apis/userController");
const dashboardController = require("../apps/controllers/apis/dashboardController");
const newsController = require("../apps/controllers/apis/newsController");
const chatController = require("../apps/controllers/apis/chatController");

// ============================================
// AUTH ROUTES
// ============================================

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user account
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post("/register", userResult, userValidator, authController.register);

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate user and receive access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginResult, loginValidator, authController.login);

/**
 * @openapi
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User logout
 *     description: Logout user and invalidate tokens
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", verifyAccessToken, authController.logout);

/**
 * @openapi
 * /refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid refresh token
 */
router.post("/refresh", verifyRefreshToken, authController.refreshToken);

/**
 * @openapi
 * /me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user profile
 *     description: Retrieve the profile of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", verifyAccessToken, authController.getMe);

// ============================================
// UPLOAD ROUTES (Admin)
// ============================================

/**
 * @openapi
 * /upload/products:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload product image
 *     description: Upload image file for product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */

// ============================================
// SOCIAL AUTH ROUTES
// ============================================

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Google login
 *     description: Login or register using Google OAuth access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: ya29.a0AfH6SM...
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Access token is required
 *       500:
 *         description: Server error
 */
router.post("/auth/google", authController.googleLogin);

/**
 * @openapi
 * /auth/facebook:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Facebook login
 *     description: Login or register using Facebook OAuth access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: EAABwzLixnjY...
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Access token is required
 *       500:
 *         description: Server error
 */
router.post("/auth/facebook", authController.facebookLogin);

// upload routes
router.post("/upload/products", verifyAccessToken, isAdmin, setFolder("products"), uploadMiddleware, uploadController.uploadImage);

/**
 * @openapi
 * /upload/sliders:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload slider image
 *     description: Upload image file for slider (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/upload/sliders", verifyAccessToken, isAdmin, setFolder("sliders"), uploadMiddleware, uploadController.uploadImage);

/**
 * @openapi
 * /upload/logos:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload logo image
 *     description: Upload image file for logo (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/upload/logos", verifyAccessToken, isAdmin, setFolder("logos"), uploadMiddleware, uploadController.uploadImage);

// ============================================
// CATEGORY ROUTES
// ============================================

/**
 * @openapi
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieve list of all product categories (Public)
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/category", categoryController.getAll);

/**
 * @openapi
 * /category/{id}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get category by ID
 *     description: Retrieve a specific category by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/category/:id", categoryController.findById);

/**
 * @openapi
 * /category:
 *   post:
 *     tags:
 *       - Category
 *     summary: Create new category
 *     description: Create a new product category (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphones
 *               icon:
 *                 type: string
 *                 example: icon-phone
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/category", verifyAccessToken, isAdmin, categoryRules, categoryValidator, categoryController.create);

/**
 * @openapi
 * /category/{id}:
 *   put:
 *     tags:
 *       - Category
 *     summary: Update category
 *     description: Update an existing category (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.put("/category/:id", verifyAccessToken, isAdmin, categoryRules, categoryValidator, categoryController.update);

/**
 * @openapi
 * /category/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Delete category
 *     description: Delete a category (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.delete("/category/:id", verifyAccessToken, isAdmin, categoryController.remove);

// ============================================
// BRAND ROUTES
// ============================================

/**
 * @openapi
 * /brand:
 *   get:
 *     tags:
 *       - Brand
 *     summary: Get all brands
 *     description: Retrieve list of all brands (Public)
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 */
router.get("/brand", brandController.findAll);

/**
 * @openapi
 * /brand/{id}:
 *   get:
 *     tags:
 *       - Brand
 *     summary: Get brand by ID
 *     description: Retrieve a specific brand by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 *       404:
 *         description: Brand not found
 */
router.get("/brand/:id", brandController.findById);

/**
 * @openapi
 * /brand:
 *   post:
 *     tags:
 *       - Brand
 *     summary: Create new brand
 *     description: Create a new brand (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/brand", verifyAccessToken, isAdmin, brandRules, brandValidator, brandController.create);

/**
 * @openapi
 * /brand/{id}:
 *   put:
 *     tags:
 *       - Brand
 *     summary: Update brand
 *     description: Update an existing brand (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.put("/brand/:id", verifyAccessToken, isAdmin, brandRules, brandValidator, brandController.update);

/**
 * @openapi
 * /brand/{id}:
 *   delete:
 *     tags:
 *       - Brand
 *     summary: Delete brand
 *     description: Delete a brand (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.delete("/brand/:id", verifyAccessToken, isAdmin, brandController.remove);

// ============================================
// PRODUCT ROUTES
// ============================================

/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieve list of all products with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 */
router.get("/product", productController.findAll);

/**
 * @openapi
 * /product/newest:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get newest products
 *     description: Get recently added products
 *     responses:
 *       200:
 *         description: List of newest products
 */
router.get("/product/newest", productController.getNewest);

/**
 * @openapi
 * /product/favorites:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get favorite products
 *     description: Get most favorite products by users
 *     responses:
 *       200:
 *         description: List of favorite products
 */
router.get("/product/favorites", productController.getFavorites);

/**
 * @openapi
 * /product/best-seller:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get best seller products
 *     description: Get best selling products
 *     responses:
 *       200:
 *         description: List of best seller products
 */
router.get("/product/best-seller", productController.getBestSellers);

/**
 * @openapi
 * /product/category/{categoryId}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get products by category
 *     description: Retrieve products belonging to a specific category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6852f1d2ab12cd34ef56gh78
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *       404:
 *         description: Category not found
 */
router.get(
  "/product/category/:id",
  productController.getProductsByCategory
);

/**
 * @openapi
 * /product/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product by ID
 *     description: Retrieve a specific product with all details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/product/:id", productController.findById);

/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create new product
 *     description: Create a new product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 999
 *               salePrice:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               quantity:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/product", verifyAccessToken, isAdmin, productRules, productValidator, productController.create);

/**
 * @openapi
 * /product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update product
 *     description: Update an existing product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.put("/product/:id", verifyAccessToken, isAdmin, productController.update);
/**
 * @openapi
 * /product/slug/{slug}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product by slug
 *     description: Retrieve product details using SEO slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: iphone-15-pro-max-256gb
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/product/slug/:slug", productController.findBySlug);

/**
 * @openapi
 * /product/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product
 *     description: Delete a product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.delete("/product/:id", verifyAccessToken, isAdmin, productController.remove);

// ============================================
// ORDER ROUTES
// ============================================

/**
 * @openapi
 * /order:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders (for admin)
 *     description: Get all orders from all users (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.get("/order", verifyAccessToken, orderController.findAll);

/**
 * @openapi
 * /order/{id}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get order by ID
 *     description: Retrieve order details by ID (User can only view their own orders)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.get("/order/:id", verifyUser, orderController.findById);

/**
 * @openapi
 * /order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create new order
 *     description: Create a new order (Authenticated user)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               shippingAddress:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
router.post("/order", verifyUser, orderController.create);

/**
 * @openapi
 * /order/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Update order
 *     description: Update order details or status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/order/:id", verifyUser, orderController.update);

/**
 * @openapi
 * /order/{id}:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Delete order
 *     description: Delete an order (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.delete("/order/:id", verifyAccessToken, isAdmin, orderController.remove);

/**
 * @openapi
 * /order/track:
 *   post:
 *     tags:
 *       - Order
 *     summary: Track order (Guest)
 *     description: Track order by order code and phone/email for guest users (No authentication required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderCode
 *             properties:
 *               orderCode:
 *                 type: string
 *                 example: ORD2026123456
 *               phone:
 *                 type: string
 *                 example: 0123456789
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Order found
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Order not found
 *       403:
 *         description: Phone or email does not match
 */
router.post("/order/track", orderController.trackOrder);

// ============================================
// COMMENT ROUTES
// ============================================

/**
 * @openapi
 * /comment/product/{productId}:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get comments for product
 *     description: Get all approved comments for a specific product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for product
 */
router.get("/comment/product/:productId", commentController.findByIdProduct);

/**
 * @openapi
 * /admin/comments:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get all comments (Admin)
 *     description: Get all comments for moderation (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.get("/admin/comments", verifyAccessToken, isAdmin, commentController.findAll);

/**
 * @openapi
 * /comment:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Create comment
 *     description: Create a new comment on a product (Authenticated user)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - content
 *               - rating
 *             properties:
 *               product:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Comment created successfully (awaiting approval)
 *       401:
 *         description: Unauthorized
 */
router.post("/comment", verifyAccessToken, commentController.create);

/**
 * @openapi
 * /comment/{id}/approve:
 *   put:
 *     tags:
 *       - Comment
 *     summary: Approve comment
 *     description: Approve a comment (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.put("/comment/:id/approve", verifyAccessToken, isAdmin, commentController.approve);

/**
 * @openapi
 * /comment/{id}:
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete comment
 *     description: Delete a comment (Comment author or Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/comment/:id", verifyAccessToken, commentController.remove);

// ============================================
// MENU ROUTES (Public & Admin)
// ============================================

/**
 * @openapi
 * /menus:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get public menus
 *     description: Get active menus for frontend
 *     responses:
 *       200:
 *         description: List of menus
 */
router.get("/menus", menuController.getPublicMenus);

/**
 * @openapi
 * /admin/menus:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all menus (Admin)
 *     description: Get all menus for management
 *     security:
 *       - BearerAuth: []
 */
router.get("/admin/menus", verifyAccessToken, isAdmin, menuController.findAll);

/**
 * @openapi
 * /admin/menus/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get menu by ID
 */
router.get("/admin/menus/:id", verifyAccessToken, isAdmin, menuController.findById);

/**
 * @openapi
 * /admin/menus:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create menu
 *     security:
 *       - BearerAuth: []
 */
router.post("/admin/menus", verifyAccessToken, isAdmin, menuRules, menuValidator, menuController.create);

/**
 * @openapi
 * /admin/menus/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update menu
 *     security:
 *       - BearerAuth: []
 */
router.put("/admin/menus/:id", verifyAccessToken, isAdmin, menuRules, menuValidator, menuController.update);

/**
 * @openapi
 * /admin/menus/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete menu
 *     security:
 *       - BearerAuth: []
 */
router.delete("/admin/menus/:id", verifyAccessToken, isAdmin, menuController.remove);

/**
 * @openapi
 * /admin/menus/status/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Toggle menu status
 *     security:
 *       - BearerAuth: []
 */
router.patch("/admin/menus/status/:id", verifyAccessToken, isAdmin, menuController.toggleStatus);

// ============================================
// SLIDER ROUTES (Admin & Public)
// ============================================

/**
 * @openapi
 * /admin/sliders:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all sliders
 *     security:
 *       - BearerAuth: []
 */
router.get("/admin/sliders", verifyAccessToken, isAdmin, sliderController.findAll);

/**
 * @openapi
 * /admin/sliders/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get slider by ID
 *     security:
 *       - BearerAuth: []
 */
router.get("/admin/sliders/:id", verifyAccessToken, isAdmin, sliderController.findById);

/**
 * @openapi
 * /admin/sliders:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create slider
 *     security:
 *       - BearerAuth: []
 */
router.post("/admin/sliders", verifyAccessToken, isAdmin, sliderRules, sliderValidator, sliderController.create);

/**
 * @openapi
 * /admin/sliders/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update slider
 *     security:
 *       - BearerAuth: []
 */
router.put("/admin/sliders/:id", verifyAccessToken, isAdmin, sliderRules, sliderValidator, sliderController.update);

/**
 * @openapi
 * /admin/sliders/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete slider
 *     security:
 *       - BearerAuth: []
 */
router.delete("/admin/sliders/:id", verifyAccessToken, isAdmin, sliderController.remove);

/**
 * @openapi
 * /admin/sliders/status/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Toggle slider status
 *     security:
 *       - BearerAuth: []
 */
router.patch("/admin/sliders/status/:id", verifyAccessToken, isAdmin, sliderController.toggleStatus);

/**
 * @openapi
 * /sliders:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get public sliders
 *     description: Get active sliders for frontend
 */
router.get("/sliders", sliderController.getPublicSliders);

// ============================================
// SETTING ROUTES (Admin & Public)
// ============================================

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all settings
 *     security:
 *       - BearerAuth: []
 */
router.get("/admin/settings",  settingController.findAll);

/**
 * @openapi
 * /admin/settings/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get setting by ID
 *     security:
 *       - BearerAuth: []
 */
router.get("/admin/settings/:id", verifyAccessToken, isAdmin, settingController.findById);

/**
 * @openapi
 * /admin/settings:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create setting
 *     security:
 *       - BearerAuth: []
 */
router.post("/admin/settings", verifyAccessToken, isAdmin, settingRules, settingValidator, settingController.create);

/**
 * @openapi
 * /admin/settings/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update setting
 *     security:
 *       - BearerAuth: []
 */
router.put("/admin/settings/:id", verifyAccessToken, isAdmin, settingRules, settingValidator, settingController.update);

/**
 * @openapi
 * /admin/settings/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete setting
 *     security:
 *       - BearerAuth: []
 */
router.delete("/admin/settings/:id", verifyAccessToken, isAdmin, settingController.remove);

/**
 * @openapi
 * /settings:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get public settings
 *     description: Get active settings for frontend
 */
router.get("/settings", settingController.getPublicSettings);

// ============================================
// USER ROUTES (Admin)
// ============================================

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Get list of all users (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.get("/admin/users", verifyAccessToken, isAdmin, userController.findAll);

/**
 * @openapi
 * /admin/users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by ID
 *     description: Get specific user details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.get("/admin/users/:id", verifyAccessToken, isAdmin, userController.findById);

/**
 * @openapi
 * /admin/users:
 *   post:
 *     tags:
 *       - User
 *     summary: Create user
 *     description: Create a new user account (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/admin/users", verifyAccessToken, isAdmin, userResult, userValidator, userController.create);

/**
 * @openapi
 * /admin/users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user
 *     description: Update user information (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.put("/admin/users/:id", verifyAccessToken, isAdmin, userController.update);

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user
 *     description: Delete a user account (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.delete("/admin/users/:id", verifyAccessToken, isAdmin, userController.remove);

/**
 * @openapi
 * /admin/users/status/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Toggle user status
 *     description: Enable/disable user account (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.patch("/admin/users/status/:id", verifyAccessToken, isAdmin, userController.toggleStatus);

// ============================================
// ADMIN DASHBOARD ROUTES
// ============================================

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get dashboard statistics
 *     description: Get sales, orders, and users statistics (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                     totalOrders:
 *                       type: number
 *                     totalUsers:
 *                       type: number
 *                     totalProducts:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.get("/admin/dashboard", verifyAccessToken, isAdmin, dashboardController.getStats);

// ============================================
// CART ROUTES (User)
// ============================================

/**
 * @openapi
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get shopping cart
 *     description: Retrieve current user's shopping cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's shopping cart
 *       401:
 *         description: Unauthorized
 */
router.get("/cart", verifyAccessToken, cartController.getCart);

/**
 * @openapi
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add to cart
 *     description: Add a product to shopping cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 */
router.post("/cart", verifyAccessToken, cartRules, cartValidator, cartController.addToCart);

/**
 * @openapi
 * /cart/{id}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity
 *     description: Update quantity of a product in cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated
 *       401:
 *         description: Unauthorized
 */
router.put("/cart/:id", verifyAccessToken, cartController.updateQuantity);

/**
 * @openapi
 * /cart/{id}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove from cart
 *     description: Remove a product from cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 */
router.delete("/cart/:id", verifyAccessToken, cartController.removeFromCart);

/**
 * @openapi
 * /cart:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear cart
 *     description: Remove all items from cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 */
router.delete("/cart", verifyAccessToken, cartController.clearCart);

// ============================================
// FAVORITE ROUTES (User)
// ============================================

/**
 * @openapi
 * /favorites:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get user favorites
 *     description: Retrieve user's favorite products list
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 *       401:
 *         description: Unauthorized
 */
router.get("/favorites", verifyAccessToken, favoriteController.findAll);

/**
 * @openapi
 * /favorites:
 *   post:
 *     tags:
 *       - Product
 *     summary: Add to favorites
 *     description: Add a product to user's favorite list
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *             properties:
 *               product:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product added to favorites
 *       401:
 *         description: Unauthorized
 */
router.post("/favorites", verifyAccessToken, favoriteRules, favoriteValidator, favoriteController.add);

/**
 * @openapi
 * /favorites/{productId}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Remove from favorites
 *     description: Remove a product from user's favorite list
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       401:
 *         description: Unauthorized
 */
router.delete("/favorites/:productId", verifyAccessToken, favoriteController.remove);

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @openapi
 * /news:
 *   get:
 *     tags:
 *       - News
 *     summary: Get public news list
 *     description: Get active technology news with pagination and keyword search.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public news list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 */
router.get("/news", newsController.findPublic);

/**
 * @openapi
 * /news/{slug}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get public news detail
 *     description: Get active news detail by slug or id and increase view count.
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public news detail
 *       404:
 *         description: News not found
 */
router.get("/news/:slug", newsController.findPublicDetail);

/**
 * @openapi
 * /admin/news:
 *   get:
 *     tags:
 *       - News
 *     summary: Get admin news list
 *     description: Get all technology news for admin.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Admin news list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin only
 */
router.get("/admin/news", verifyAccessToken, isAdmin, newsController.findAll);

/**
 * @openapi
 * /admin/news/{id}:
 *   get:
 *     tags:
 *       - News
 *     summary: Get admin news detail
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin news detail
 *       404:
 *         description: News not found
 */
router.get("/admin/news/:id", verifyAccessToken, isAdmin, newsController.findById);

/**
 * @openapi
 * /admin/news:
 *   post:
 *     tags:
 *       - News
 *     summary: Create news
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsInput'
 *     responses:
 *       201:
 *         description: News created
 *       400:
 *         description: Validation error
 */
router.post("/admin/news", verifyAccessToken, isAdmin, newsRules, newsValidator, newsController.create);

/**
 * @openapi
 * /admin/news/{id}:
 *   put:
 *     tags:
 *       - News
 *     summary: Update news
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsInput'
 *     responses:
 *       200:
 *         description: News updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: News not found
 */
router.put("/admin/news/:id", verifyAccessToken, isAdmin, newsRules, newsValidator, newsController.update);

/**
 * @openapi
 * /admin/news/{id}:
 *   delete:
 *     tags:
 *       - News
 *     summary: Delete news
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News deleted
 *       404:
 *         description: News not found
 */
router.delete("/admin/news/:id", verifyAccessToken, isAdmin, newsController.remove);

/**
 * @openapi
 * /upload/news:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload news thumbnail
 *     description: Upload thumbnail image for news. Returns /uploads/news/filename.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successfully
 */
router.post("/upload/news", verifyAccessToken, isAdmin, setFolder("news"), uploadMiddleware, uploadController.uploadImage);

/**
 * @openapi
 * /home:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get home page data
 *     description: Get featured products, sliders, and categories for homepage
 *     responses:
 *       200:
 *         description: Homepage data with products, categories, and sliders
 */
router.get("/home", homeController.getHome);

/**
 * @openapi
 * /search:
 *   get:
 *     tags:
 *       - Product
 *     summary: Search products
 *     description: Search for products by name, category, or brand
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchController.search);

// CHAT AI SUPPORT
router.post("/chat/ai", chatController.chatWithAI);

module.exports = router;
