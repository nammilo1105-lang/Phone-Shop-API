const { body, validationResult } = require("express-validator");

const menuRules = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Title must be between 2 and 100 characters"),

    body("url")
        .notEmpty()
        .withMessage("Url is required")
        .isLength({ min: 1, max: 255 })
        .withMessage("Url must be between 1 and 255 characters"),

    body("parent_id")
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage("parent_id must be a valid Mongo ID"),

    body("sort_order")
        .optional()
        .isInt({ min: 0 })
        .withMessage("sort_order must be a positive integer"),

    body("position")
        .optional()
        .isString()
        .withMessage("position must be a string"),

    body("status")
        .optional()
        .isBoolean()
        .withMessage("status must be a boolean"),
];

const menuValidator = (req, res, next) => {
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
    menuRules,
    menuValidator,
};
