const mongoose = require("../../common/init.mongo")();

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            unique: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const cartModel = mongoose.model(
    "Carts",
    cartSchema,
    "carts"
);

module.exports = cartModel;