const mongoose = require("../../common/init.mongo")();

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        country: {
            type: String,
            required: true,
            trim: true,
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

const brandModel = mongoose.model(
    "Brands",
    brandSchema,
    "brands"
);

module.exports = brandModel;