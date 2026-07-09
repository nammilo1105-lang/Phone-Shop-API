const { body, validationResult } = require("express-validator");

const sliderRules = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Title must be between 2 and 100 characters"),

    body("image")
        .notEmpty()
        .withMessage("Image is required"),

    body("link")
        .optional()
        .isString()
        .withMessage("Link must be a string"),

    body("sort_order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("sort_order must be a positive integer"),

    body("status")
        .optional()
        .isBoolean()
        .withMessage("status must be a boolean"),
];

const sliderValidator = (req, res, next) => {
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
    sliderRules,
    sliderValidator,
};
