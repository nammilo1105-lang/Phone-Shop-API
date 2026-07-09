const mongoose = require("../../common/init.mongo")();

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },

        accessToken: {
            type: String,
            required: true,
            trim: true,
        },

        refreshToken: {
            type: String,
            required: true,
            trim: true,
        },

        device: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const tokenModel = mongoose.model(
    "Tokens",
    tokenSchema,
    "tokens"
);

module.exports = tokenModel;