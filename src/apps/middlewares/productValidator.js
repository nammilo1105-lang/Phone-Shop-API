const { body, validationResult } = require("express-validator");

const productRules = [
    body("category_id")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Invalid category id"),

    body("brand_id")
        .notEmpty()
        .withMessage("Brand is required")
        .isMongoId()
        .withMessage("Invalid brand id"),

    body("name")
        .notEmpty()
        .withMessage("Product name is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 0 })
        .withMessage("Quantity must be greater than or equal to 0"),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be boolean"),

    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be boolean"),
];
const productValidator = (req, res, next) => {
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
    productRules,
    productValidator,
};