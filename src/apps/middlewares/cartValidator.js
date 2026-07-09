const { body, validationResult } = require("express-validator");

const cartRules = [
    body("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format"),

    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be an integer and at least 1"),
];

const cartValidator = (req, res, next) => {
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
    cartRules,
    cartValidator,
};
