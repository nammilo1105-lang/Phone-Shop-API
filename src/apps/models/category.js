const mongoose = require("../../common/init.mongo")();

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },

        order: {
            type: Number,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const categoryModel = mongoose.model(
    "category",
    categorySchema,
    "categories"
);

module.exports = categoryModel;