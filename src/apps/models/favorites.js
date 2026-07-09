const mongoose = require("../../common/init.mongo")();

const favoriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const favoriteModel = mongoose.model(
    "Favorites",
    favoriteSchema,
    "favorites"
);

module.exports = favoriteModel;
