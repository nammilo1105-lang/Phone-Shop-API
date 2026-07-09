const sliderModel = require("../../models/sliders");
const paginate = require("../../../libs/paginate");

exports.findAll = async (req, res) => {
    try {
        const query = { isDeleted: { $ne: true } };
        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.status !== undefined) {
            query.status = req.query.status === "true";
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const sliders = await sliderModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ sort_order: 1, createdAt: -1 });

        return res.status(200).json({
            status: "success",
            message: "Get sliders successfully",
            data: sliders,
            pages: await paginate(page, limit, query, sliderModel),
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
        const slider = await sliderModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!slider) {
            return res.status(404).json({
                status: "error",
                message: "Slider not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Get slider successfully",
            data: slider,
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
        const { title, image, link, sort_order, status } = req.body;

        const slider = await sliderModel.create({
            title: title.trim(),
            image,
            link: link || "",
            sort_order: sort_order || 0,
            status: status !== undefined ? status : true,
        });

        return res.status(201).json({
            status: "success",
            message: "Slider created successfully",
            data: slider,
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
        const { title, image, link, sort_order, status } = req.body;

        const slider = await sliderModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!slider) {
            return res.status(404).json({
                status: "error",
                message: "Slider not found",
            });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (image !== undefined) updateData.image = image;
        if (link !== undefined) updateData.link = link;
        if (sort_order !== undefined) updateData.sort_order = sort_order;
        if (status !== undefined) updateData.status = status;

        const updatedSlider = await sliderModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Slider updated successfully",
            data: updatedSlider,
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
        const slider = await sliderModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        );

        if (!slider) {
            return res.status(404).json({
                status: "error",
                message: "Slider not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Slider deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const slider = await sliderModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!slider) {
            return res.status(404).json({
                status: "error",
                message: "Slider not found",
            });
        }

        slider.status = !slider.status;
        await slider.save();

        return res.status(200).json({
            status: "success",
            message: `Slider status updated to ${slider.status ? "Active" : "Inactive"}`,
            data: slider,
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
exports.getPublicSliders = async (req, res) => {
    try {
        const sliders = await sliderModel
            .find({ status: true, isDeleted: { $ne: true } })
            .sort({ sort_order: 1, createdAt: -1 });

        return res.status(200).json({
            status: "success",
            message: "Get public sliders successfully",
            data: sliders,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};