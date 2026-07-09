const settingModel = require("../../models/settings");

exports.findAll = async (req, res) => {
    try {
        const settings = await settingModel.find();
        return res.status(200).json({
            status: "success",
            message: "Get settings successfully",
            data: settings,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const setting = await settingModel.findById(id);
        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Get setting successfully",
            data: setting,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { site_name, logo, email, phone, address, facebook, youtube, zalo, chatUrl } = req.body;

        const setting = await settingModel.create({
            site_name: site_name.trim(),
            logo: logo || "",
            email: email || "",
            phone: phone || "",
            address: address || "",
            facebook: facebook || "",
            youtube: youtube || "",
            zalo: zalo || "",
            chatUrl: chatUrl || "",
        });

        return res.status(201).json({
            status: "success",
            message: "Setting created successfully",
            data: setting,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { site_name, logo, email, phone, address, facebook, youtube, zalo, chatUrl } = req.body;

        const setting = await settingModel.findById(id);
        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }

        const updateData = {};
        if (site_name !== undefined) updateData.site_name = site_name.trim();
        if (logo !== undefined) updateData.logo = logo;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (facebook !== undefined) updateData.facebook = facebook;
        if (youtube !== undefined) updateData.youtube = youtube;
        if (zalo !== undefined) updateData.zalo = zalo;
        if (chatUrl !== undefined) updateData.chatUrl = chatUrl;

        const updatedSetting = await settingModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Setting updated successfully",
            data: updatedSetting,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const setting = await settingModel.findByIdAndDelete(id);
        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Setting deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Public
exports.getPublicSettings = async (req, res) => {
    try {
        const setting = await settingModel.findOne() || {
            site_name: "Vietpro Phone Shop",
            logo: "",
            email: "nammilo1105@gmail.com",
            phone: "",
            address: "",
            facebook: "",
            youtube: "",
            zalo: "",
            chatUrl: "",
        };
        return res.status(200).json({
            status: "success",
            message: "Get public settings successfully",
            data: setting,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};