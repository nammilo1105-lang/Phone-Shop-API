const express = require("express");
const app = express();
const config = require("config");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../../config/swagger");

app.use(cors());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
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

// Serve static uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(config.get("app.prefixApiVersion"), require("../routers/web"));

module.exports = app;