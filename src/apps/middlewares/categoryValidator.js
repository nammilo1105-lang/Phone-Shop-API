const { body, validationResult } = require("express-validator");

const categoryRules = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters"),

    body("order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Order must be a positive number"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be boolean"),
];


const categoryValidator = (req, res, next) => {
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
    categoryRules,
    categoryValidator,
};