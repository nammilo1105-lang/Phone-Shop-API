# Swagger Annotation Examples - Phone Shop API

Tài liệu này giúp bạn hiểu cách viết Swagger annotations cho endpoints mới.

---

## 📝 Cấu trúc Annotation Cơ Bản

### 1. GET Request (Public)
```javascript
/**
 * @openapi
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieve list of all product categories (Public endpoint)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
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
```

### 2. GET Request (Private - Protected)
```javascript
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
```

### 3. GET Request with Path Parameter
```javascript
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
 *       404:
 *         description: Product not found
 */
router.get("/product/:id", productController.findById);
```

### 4. POST Request (Create)
```javascript
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Latest iPhone model
 *               price:
 *                 type: number
 *                 example: 999
 *               category:
 *                 type: string
 *                 description: Category ID
 *               brand:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (Admin only)
 */
router.post("/product", verifyAccessToken, isAdmin, productRules, productValidator, productController.create);
```

### 5. PUT Request (Update)
```javascript
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
 *         description: Access denied
 *       404:
 *         description: Product not found
 */
router.put("/product/:id", verifyAccessToken, isAdmin, productController.update);
```

### 6. DELETE Request
```javascript
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
 *         description: Access denied
 */
router.delete("/product/:id", verifyAccessToken, isAdmin, productController.remove);
```

### 7. PATCH Request (Partial Update)
```javascript
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch("/admin/users/status/:id", verifyAccessToken, isAdmin, userController.toggleStatus);
```

---

## 🔑 Key Components Giải Thích

### Tags
```javascript
tags:
  - Product    // Nhóm endpoint này vào tab "Product"
```

### Summary & Description
```javascript
summary: Get all products          // Tiêu đề ngắn
description: Retrieve all products // Mô tả chi tiết
```

### Security
```javascript
security:
  - BearerAuth: []  // Yêu cầu JWT token
```

**Không có `security`**: Endpoint public (không cần token)

### Parameters

#### Query Parameters
```javascript
parameters:
  - in: query
    name: page
    schema:
      type: integer
    description: Page number
```

#### Path Parameters
```javascript
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
```

### Request Body
```javascript
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:           # Required fields
          - name
          - email
        properties:
          name:
            type: string
            example: John Doe
          email:
            type: string
            format: email
```

### Responses
```javascript
responses:
  200:
    description: Success message
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              $ref: '#/components/schemas/User'  // Reference to schema
  400:
    description: Bad request
  401:
    description: Unauthorized
```

---

## 📦 Using Component Schemas

### Referencing Built-in Schemas
```javascript
// Reference User schema
data:
  $ref: '#/components/schemas/User'

// Reference Product schema
data:
  $ref: '#/components/schemas/Product'

// Reference Order schema
data:
  $ref: '#/components/schemas/Order'
```

### Available Schemas
- `#/components/schemas/User`
- `#/components/schemas/Product`
- `#/components/schemas/Category`
- `#/components/schemas/Brand`
- `#/components/schemas/Order`
- `#/components/schemas/Error`

---

## 🎯 Real-World Examples

### Example 1: Login API
```javascript
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate user and receive tokens
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
 */
router.post("/login", loginResult, loginValidator, authController.login);
```

### Example 2: Get Products with Filters
```javascript
/**
 * @openapi
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieve products with pagination and filters
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
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/product", productController.findAll);
```

### Example 3: Create Order
```javascript
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
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: 65a1b2c3d4e5f6g7h8i9j0k1
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 example: 123 Main St, New York, NY 10001
 *               notes:
 *                 type: string
 *                 example: Please deliver between 9-5pm
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
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/order", verifyUser, orderController.create);
```

---

## 💡 Tips & Best Practices

### 1. Luôn thêm security nếu endpoint yêu cầu token
```javascript
security:
  - BearerAuth: []
```

### 2. Thêm examples cho dễ hiểu
```javascript
example: 65a1b2c3d4e5f6g7h8i9j0k1
```

### 3. Luôn document error responses
```javascript
401:
  description: Unauthorized
403:
  description: Access denied (Admin only)
404:
  description: Not found
```

### 4. Group related endpoints với cùng tags
```javascript
tags:
  - Product
```

### 5. Sử dụng schema references để tránh lặp code
```javascript
$ref: '#/components/schemas/User'
```

### 6. Thêm description cho parameters
```javascript
description: Product category ID
```

---

## 🔄 Available Tags

- `Auth` - Authentication
- `Product` - Products
- `Category` - Categories
- `Brand` - Brands
- `Order` - Orders
- `Cart` - Shopping cart
- `Comment` - Comments/Reviews
- `User` - User management
- `Admin` - Admin functions
- `Upload` - File uploads

---

## 🚀 Thêm Endpoint Mới

### Step 1: Tạo annotation
```javascript
/**
 * @openapi
 * /my-new-endpoint:
 *   get:
 *     tags:
 *       - MyTag
 *     summary: My endpoint summary
 *     description: Detailed description
 */
```

### Step 2: Thêm route
```javascript
router.get("/my-new-endpoint", controller.method);
```

### Step 3: Restart server
```bash
npm run dev
```

### Step 4: Kiểm tra Swagger
Truy cập `http://localhost:5000/api-docs` và xem endpoint mới

---

## ✅ Checklist

Khi thêm endpoint mới, đảm bảo:
- ✅ Annotation có syntax đúng
- ✅ Tag được chỉ định
- ✅ Summary ngắn gọn
- ✅ Security được thêm nếu cần
- ✅ Parameters được document
- ✅ Request body schema đầy đủ
- ✅ Responses được defined
- ✅ Examples được thêm

---

**Happy documenting! 🎉**
