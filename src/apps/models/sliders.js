const mongoose = require("../../common/init.mongo")();

const sliderSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        link: {
            type: String,
            default: "",
            trim: true,
        },
        sort_order: {
            type: Number,
            default: 0,
        },
        status: {
            type: Boolean,
            default: true,
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

const sliderModel = mongoose.model("Sliders", sliderSchema, "sliders");

module.exports = sliderModel;
