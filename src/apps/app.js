const express = require("express");
const app = express();
const config = require("config");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../../config/swagger");

// Danh sách domain được phép gọi API
const allowedOrigins = [
  "http://localhost:5173",
  "https://phone-shop-fe-omega.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // cho phép request không có origin (Postman, server-to-server...)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(config.get("app.prefixApiVersion"), require("../routers/web"));

module.exports = app;