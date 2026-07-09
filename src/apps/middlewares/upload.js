const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.uploadFolder || "others";
        const uploadPath = path.join(process.cwd(), "uploads", folder);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (.jpg, .jpeg, .png, .webp) are allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).any(); // Use .any() to dynamically accept any field name and avoid "Unexpected field" errors

const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    status: "error",
                    message: `Upload error: ${err.message}`,
                });
            }
            return res.status(400).json({
                status: "error",
                message: err.message,
            });
        }
        next();
    });
};

const setFolder = (folder) => {
    return (req, res, next) => {
        req.uploadFolder = folder;
        next();
    };
};

module.exports = {
    uploadMiddleware,
    setFolder
};