const { body, validationResult } = require("express-validator");
const newsModel = require("../models/news.model");

const newsRules = [
    body("title")
        .notEmpty()
        .withMessage("Title is required"),

    body("slug")
        .notEmpty()
        .withMessage("Slug is required")
        .custom(async (value, { req }) => {
            const query = { slug: value };
            if (req.params.id) {
                query._id = { $ne: req.params.id };
            }

            const news = await newsModel.findOne(query);
            if (news) {
                throw new Error("Slug already exists");
            }

            return true;
        }),

    body("shortDescription")
        .notEmpty()
        .withMessage("Short description is required"),

    body("content")
        .notEmpty()
        .withMessage("Content is required"),

    body("status")
        .optional()
        .isBoolean()
        .withMessage("Status must be boolean"),
];

const newsValidator = (req, res, next) => {
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
    newsRules,
    newsValidator,
};
