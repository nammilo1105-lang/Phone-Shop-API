const mongoose = require("../../common/init.mongo")();

const newsSchema = new mongoose.Schema(
    {
        title: {
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
            index: true,
        },

        thumbnail: {
            type: String,
            default: "",
            trim: true,
        },

        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            default: "Admin",
            trim: true,
        },

        viewCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const newsModel = mongoose.model("News", newsSchema, "news");

module.exports = newsModel;
