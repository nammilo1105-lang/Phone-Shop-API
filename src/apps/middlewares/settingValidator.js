const { body, validationResult } = require("express-validator");

const settingRules = [
    body("site_name")
        .notEmpty()
        .withMessage("Site name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Site name must be between 2 and 100 characters"),

    body("email")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("Must be a valid email address"),

    body("phone")
        .optional()
        .isString()
        .withMessage("Phone must be a string"),

    body("address")
        .optional()
        .isString()
        .withMessage("Address must be a string"),
];

const settingValidator = (req, res, next) => {
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
    settingRules,
    settingValidator,
};
