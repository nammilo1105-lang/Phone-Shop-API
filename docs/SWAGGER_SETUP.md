# Phone Shop API - Swagger Documentation Setup Guide

## ✅ Setup Hoàn Thành

Swagger documentation đã được setup hoàn chỉnh cho dự án PHONE-SHOP-API.

---

## 🚀 Chạy Project

### 1. Cài đặt Dependencies
```bash
cd PHONE-SHOP-API
npm install
```

### 2. Chạy Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: **http://localhost:5000**

---

## 📖 Truy cập Swagger Documentation

**Swagger UI URL:** http://localhost:5000/api-docs

Sau khi server chạy, mở URL này trong trình duyệt để xem API documentation.

---

## 🔑 JWT Authentication trong Swagger

### Bước 1: Đăng nhập
1. Nhấp vào endpoint `/login` trong tab **Auth**
2. Nhập email và password
3. Copy **accessToken** từ response

### Bước 2: Thiết lập JWT Token
1. Click vào nút **"Authorize"** (🔒) ở góc trên phải của Swagger UI
2. Paste token vào ô `BearerAuth`:
   ```
   Bearer YOUR_ACCESS_TOKEN_HERE
   ```
3. Click **"Authorize"** để apply token
4. Click **"Logout"** để xóa token

Sau khi authorize, các endpoint cần authentication sẽ tự động gửi JWT token.

---

## 📚 API Endpoints Overview

### Auth (Xác thực)
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `POST /refresh` - Làm mới access token
- `GET /me` - Lấy thông tin user hiện tại

### Product (Sản phẩm)
- `GET /product` - Lấy danh sách sản phẩm (có phân trang)
- `GET /product/newest` - Sản phẩm mới nhất
- `GET /product/favorites` - Sản phẩm yêu thích nhất
- `GET /product/best-seller` - Sản phẩm bán chạy
- `GET /product/{id}` - Chi tiết sản phẩm
- `POST /product` - Tạo sản phẩm (Admin)
- `PUT /product/{id}` - Cập nhật sản phẩm (Admin)
- `DELETE /product/{id}` - Xóa sản phẩm (Admin)

### Category (Danh mục)
- `GET /category` - Lấy tất cả danh mục
- `GET /category/{id}` - Chi tiết danh mục
- `POST /category` - Tạo danh mục (Admin)
- `PUT /category/{id}` - Cập nhật danh mục (Admin)
- `DELETE /category/{id}` - Xóa danh mục (Admin)

### Brand (Thương hiệu)
- `GET /brand` - Lấy tất cả thương hiệu
- `GET /brand/{id}` - Chi tiết thương hiệu
- `POST /brand` - Tạo thương hiệu (Admin)
- `PUT /brand/{id}` - Cập nhật thương hiệu (Admin)
- `DELETE /brand/{id}` - Xóa thương hiệu (Admin)

### Order (Đơn hàng)
- `GET /order` - Lấy danh sách đơn (Admin)
- `GET /order/{id}` - Chi tiết đơn hàng
- `POST /order` - Tạo đơn hàng mới
- `PUT /order/{id}` - Cập nhật đơn hàng
- `DELETE /order/{id}` - Xóa đơn hàng (Admin)

### Cart (Giỏ hàng)
- `GET /cart` - Lấy giỏ hàng hiện tại
- `POST /cart` - Thêm vào giỏ hàng
- `PUT /cart/{id}` - Cập nhật số lượng
- `DELETE /cart/{id}` - Xóa khỏi giỏ hàng
- `DELETE /cart` - Xóa toàn bộ giỏ hàng

### Comment (Bình luận)
- `GET /comment/product/{productId}` - Lấy bình luận sản phẩm
- `GET /admin/comments` - Lấy tất cả bình luận (Admin)
- `POST /comment` - Tạo bình luận mới
- `PUT /comment/{id}/approve` - Phê duyệt bình luận (Admin)
- `DELETE /comment/{id}` - Xóa bình luận

### User (Quản lý người dùng - Admin)
- `GET /admin/users` - Lấy danh sách users
- `GET /admin/users/{id}` - Chi tiết user
- `POST /admin/users` - Tạo user mới
- `PUT /admin/users/{id}` - Cập nhật user
- `DELETE /admin/users/{id}` - Xóa user
- `PATCH /admin/users/status/{id}` - Bật/tắt trạng thái user

### Admin Dashboard
- `GET /admin/dashboard` - Thống kê dashboard

### Upload (Tải tệp lên)
- `POST /upload/products` - Tải ảnh sản phẩm
- `POST /upload/sliders` - Tải ảnh slider
- `POST /upload/logos` - Tải logo

### Menu & Slider & Settings
- `GET /menus` - Lấy menu công khai
- `GET /sliders` - Lấy slider công khai
- `GET /settings` - Lấy settings công khai

### Public Routes
- `GET /home` - Dữ liệu trang chủ
- `GET /search` - Tìm kiếm sản phẩm

---

## 🔐 Security & Authentication

### JWT Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifetime
- **Access Token**: Tồn tại trong thời gian short (15 phút)
- **Refresh Token**: Dùng để lấy access token mới

### Roles
- **Admin**: Full access to all endpoints
- **User**: Can only access personal data (orders, favorites, comments, cart)

---

## 📁 Project Structure

```
PHONE-SHOP-API/
├── config/
│   ├── app.js              # App config
│   ├── swagger.js          # ✨ Swagger configuration (MAIN)
│   ├── db.js
│   └── ...
├── src/
│   ├── apps/
│   │   ├── app.js          # Express app setup
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Custom middlewares
│   │   └── models/         # Database models
│   ├── routers/
│   │   └── web.js          # ✨ All routes with annotations
│   ├── bin/
│   │   └── www.js          # Server entry point
│   └── ...
└── SWAGGER_SETUP.md        # This file
```

---

## 🛠️ Adding New Endpoints to Swagger

### Format Annotation
Để thêm endpoint mới vào Swagger, thêm JSDoc comment trước route definition:

```javascript
/**
 * @openapi
 * /path:
 *   post:
 *     tags:
 *       - Tag Name
 *     summary: Short description
 *     description: Long description
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fieldName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 *       401:
 *         description: Unauthorized
 */
router.post("/path", middleware, controller.method);
```

### Example - Thêm Search Endpoint
```javascript
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
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchController.search);
```

### Example - Thêm Create Endpoint
```javascript
/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create new product
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
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/product", verifyAccessToken, isAdmin, productController.create);
```

---

## ✅ Kiểm tra Swagger

### 1. Swagger được sinh tự động từ annotations trong web.js
### 2. Tất cả endpoints đã được document:
   - ✅ Auth (5 endpoints)
   - ✅ Upload (3 endpoints)
   - ✅ Category (5 endpoints)
   - ✅ Brand (5 endpoints)
   - ✅ Product (8 endpoints)
   - ✅ Order (5 endpoints)
   - ✅ Comment (5 endpoints)
   - ✅ Cart (5 endpoints)
   - ✅ Favorites (3 endpoints)
   - ✅ User (6 endpoints)
   - ✅ Admin Dashboard (1 endpoint)
   - ✅ Menu (7 endpoints)
   - ✅ Slider (8 endpoints)
   - ✅ Settings (6 endpoints)
   - ✅ Public Routes (2 endpoints)

---

## 🎯 Features

✨ **Hoàn toàn tích hợp**
- Swagger UI tại `/api-docs`
- JWT Authorization button (🔒)
- Component schemas (User, Product, Order, etc.)
- Tags for better organization
- Full CRUD operations documented
- Error responses explained
- Parameter descriptions
- Request/Response examples

---

## 🔧 Troubleshooting

### Swagger không hiển thị?
1. Kiểm tra server đã chạy: `npm run dev`
2. Truy cập: `http://localhost:5000/api-docs`
3. Kiểm tra console có error không

### Endpoints không hiển thị?
1. Kiểm tra annotations có syntax đúng không
2. Kiểm tra annotations có trong file `src/routers/web.js` không
3. Restart server

### JWT Token không work?
1. Đảm bảo token được copy chính xác
2. Thêm `Bearer ` prefix
3. Click "Authorize" button
4. Kiểm tra token chưa hết hạn

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. File config: `config/swagger.js`
2. Routes file: `src/routers/web.js`
3. App setup: `src/apps/app.js`

---

**Swagger Setup: ✅ HOÀN THÀNH**

Bây giờ bạn có thể:
- ✅ Xem tất cả API endpoints
- ✅ Test APIs trực tiếp trên Swagger UI
- ✅ Authenticate với JWT token
- ✅ Xem request/response formats
- ✅ Share documentation với team
