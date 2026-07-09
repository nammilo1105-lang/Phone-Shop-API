const mongoose = require("../../common/init.mongo")();

const settingSchema = new mongoose.Schema(
    {
        site_name: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
        },
        address: {
            type: String,
            default: "",
            trim: true,
        },
        facebook: {
            type: String,
            default: "",
            trim: true,
        },
        youtube: {
            type: String,
            default: "",
            trim: true,
        },
        zalo: {
            type: String,
            default: "",
            trim: true,
        },
        chatUrl: {
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

const settingModel = mongoose.model("Settings", settingSchema, "settings");

module.exports = settingModel;
