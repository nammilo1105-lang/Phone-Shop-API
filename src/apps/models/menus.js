const mongoose = require("../../common/init.mongo")();

const menuSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            default: null,
            index: true,
        },

        sort_order: {
            type: Number,
            default: 0,
            index: true,
        },

        position: {
            type: String,
            enum: ["header", "footer"],
            default: "header",
            index: true,
        },

        status: {
            type: Boolean,
            default: true,
            index: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Menu", menuSchema, "menus");
