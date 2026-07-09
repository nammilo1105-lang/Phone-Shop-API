# Database Schema - Phone Shop API

## Overview

* **Database:** MongoDB
* **ODM:** Mongoose
* **Architecture:** RESTful API
* **Authentication:** JWT + Refresh Token
* **Roles:** `admin`, `staff`, `customer`

---

# users

```js
{
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["admin", "staff", "customer"],
        default: "customer"
    },

    status: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date,
        default: null
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# tokens

```js
{
    userId: {
        type: ObjectId,
        ref: "users",
        required: true,
        index: true
    },

    refreshToken: {
        type: String,
        required: true
    },

    device: {
        type: String,
        default: ""
    },

    ip: {
        type: String,
        default: ""
    },

    expiresAt: {
        type: Date,
        required: true
    },

    revoked: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
```

---

# categories

```js
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },

    image: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    order: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# brands

```js
{
    name: {
        type: String,
        required: true,
        unique: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    logo: {
        type: String,
        default: ""
    },

    country: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# products

```js
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },

    sku: {
        type: String,
        unique: true,
        index: true
    },

    categoryId: {
        type: ObjectId,
        ref: "categories",
        required: true,
        index: true
    },

    brandId: {
        type: ObjectId,
        ref: "brands",
        required: true,
        index: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    discountPrice: {
        type: Number,
        default: 0,
        min: 0
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    thumbnail: {
        type: String,
        default: ""
    },

    images: {
        type: [String],
        default: []
    },

    shortDescription: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    },

    specifications: {

        cpu: String,

        ram: String,

        rom: String,

        screen: String,

        battery: String,

        cameraRear: String,

        cameraFront: String,

        operatingSystem: String,

        chipset: String,

        refreshRate: String,

        charging: String,

        sim: String,

        weight: String
    },

    colors: {
        type: [String],
        default: []
    },

    warranty: {
        type: String,
        default: "12 tháng"
    },

    soldCount: {
        type: Number,
        default: 0
    },

    favoriteCount: {
        type: Number,
        default: 0
    },

    averageRating: {
        type: Number,
        default: 0
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    isNew: {
        type: Boolean,
        default: true
    },

    status: {
        type: Boolean,
        default: true
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# carts

```js
{
    userId: {
        type: ObjectId,
        ref: "users",
        required: true,
        unique: true,
        index: true
    },

    items: [

        {

            productId: {

                type: ObjectId,

                ref: "products",

                required: true

            },

            quantity: {

                type: Number,

                default: 1,

                min: 1

            }

        }

    ]
},
{
    timestamps: true
}
```

---

# orders

```js
{
    orderCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    userId: {
        type: ObjectId,
        ref: "users",
        index: true
    },

    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    items: [

        {

            productId: {

                type: ObjectId,

                ref: "products"

            },

            productName: String,

            thumbnail: String,

            price: Number,

            quantity: Number

        }

    ],

    totalPrice: {
        type: Number,
        required: true
    },

    shippingFee: {
        type: Number,
        default: 0
    },

    paymentMethod: {
        type: String,
        enum: ["COD"]
    },

    paymentStatus: {
        type: String,
        enum: ["Unpaid", "Paid", "Refunded"],
        default: "Unpaid"
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipping",
            "Completed",
            "Cancelled"
        ],
        default: "Pending"
    },

    note: {
        type: String,
        default: ""
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# comments

```js
{
    userId: {
        type: ObjectId,
        ref: "users",
        required: true,
        index: true
    },

    productId: {
        type: ObjectId,
        ref: "products",
        required: true,
        index: true
    },

    parentId: {
        type: ObjectId,
        ref: "comments",
        default: null
    },

    content: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },

    status: {
        type: Boolean,
        default: true
    },

    deletedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
```

---

# favorites

```js
{
    userId: {
        type: ObjectId,
        ref: "users",
        required: true,
        index: true
    },

    productId: {
        type: ObjectId,
        ref: "products",
        required: true,
        index: true
    }
},
{
    timestamps: true
}
```

> Composite Unique Index:
>
> `(userId, productId)`

---

# menus

```js
{
    title: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    icon: {
        type: String,
        default: ""
    },

    order: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
```

---

# sliders

```js
{
    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    link: {
        type: String,
        default: ""
    },

    order: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
}
```

---

# settings

```js
{
    websiteName: {
        type: String,
        required: true
    },

    logo: {
        type: String,
        default: ""
    },

    favicon: {
        type: String,
        default: ""
    },

    hotline: {
        type: String,
        default: ""
    },

    emailReceiveOrder: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    facebook: {
        type: String,
        default: ""
    },

    zalo: {
        type: String,
        default: ""
    },

    youtube: {
        type: String,
        default: ""
    },

    tiktok: {
        type: String,
        default: ""
    },

    instagram: {
        type: String,
        default: ""
    },

    chatUrl: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
}
```

---

# Collection Relationship

```text
users
 ├────────► tokens
 ├────────► carts
 ├────────► orders
 ├────────► favorites
 └────────► comments
                    │
                    ▼
                products
                │      │
                ▼      ▼
          categories  brands
```

---

# RESTful API Convention

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
GET    /api/auth/profile
```

## Users

```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id
```

## Categories

```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

## Brands

```
GET    /api/brands
GET    /api/brands/:id
POST   /api/brands
PATCH  /api/brands/:id
DELETE /api/brands/:id
```

## Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

## Carts

```
GET    /api/carts
POST   /api/carts
PATCH  /api/carts
DELETE /api/carts/:productId
```

## Orders

```
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id
DELETE /api/orders/:id
```

## Comments

```
GET    /api/comments
POST   /api/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

## Favorites

```
GET    /api/favorites
POST   /api/favorites
DELETE /api/favorites/:productId
```

## Menus

```
GET    /api/menus
POST   /api/menus
PATCH  /api/menus/:id
DELETE /api/menus/:id
```

## Sliders

```
GET    /api/sliders
POST   /api/sliders
PATCH  /api/sliders/:id
DELETE /api/sliders/:id
```

## Settings

```
GET    /api/settings
PATCH  /api/settings
```

---

# Query Standard

```
?page=1
&limit=10
&keyword=iphone
&categoryId=
&brandId=
&minPrice=
&maxPrice=
&sort=price
&sort=-createdAt
```

---

# Standard Response

```json
{
    "success": true,
    "message": "Success",
    "data": {},
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "totalPages": 10
    }
}
```

---

# HTTP Status Code

```
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error
```
