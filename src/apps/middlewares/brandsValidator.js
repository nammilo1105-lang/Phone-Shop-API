const { body, validationResult } = require("express-validator");

const brandRules = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("country")
        .notEmpty()
        .withMessage("Country is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Country must be between 2 and 100 characters"),
];

const brandValidator = (req, res, next) => {
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
    brandRules,
    brandValidator,
};