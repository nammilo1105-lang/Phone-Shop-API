const mongoose = require("../../common/init.mongo")();

const commentSchema = new mongoose.Schema(
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

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },

        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments",
            default: null,
        },

        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const commentModel = mongoose.model(
    "Comments",
    commentSchema,
    "comments"
);

module.exports = commentModel;