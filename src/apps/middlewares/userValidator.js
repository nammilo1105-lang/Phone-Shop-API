const { body, validationResult } = require("express-validator");

const userResult = [
    body("fullName")
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("phone")
        .notEmpty()
        .withMessage("Phone is required")
        .isMobilePhone("vi-VN")
        .withMessage("Phone must be a valid Vietnam phone number"),

    body("address")
        .notEmpty()
        .withMessage("Address is required"),

    body("role")
        .optional()
        .isIn(["admin", "user"])
        .withMessage("Role must be admin or user"),

    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be boolean"),
];

const userValidator = (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                message: "Validation failed",
                errors: errors.array(),
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    userResult,
    userValidator,
};