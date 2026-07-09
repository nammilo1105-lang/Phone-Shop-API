const menuModel = require("../../models/menus");
const paginate = require("../../../libs/paginate");

exports.findAll = async (req, res) => {
    try {
        const query = { isDeleted: { $ne: true } };
        if (req.query.keyword) {
            query.title = { $regex: req.query.keyword, $options: "i" };
        }
        if (req.query.position) {
            query.position = req.query.position;
        }
        if (req.query.status !== undefined) {
            query.status = req.query.status === "true";
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const menus = await menuModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ sort_order: 1, createdAt: -1 })
            .populate("parent_id", "title url");

        return res.status(200).json({
            status: "success",
            message: "Get menus successfully",
            data: menus,
            pages: await paginate(page, limit, query, menuModel),
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
        const menu = await menuModel
            .findOne({ _id: id, isDeleted: { $ne: true } })
            .populate("parent_id", "title url");
        if (!menu) {
            return res.status(404).json({
                status: "error",
                message: "Menu not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Get menu successfully",
            data: menu,
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
        const { title, url, parent_id, sort_order, position, status } = req.body;

        if (!title || !url) {
            return res.status(400).json({
                status: "error",
                message: "Title and url are required",
            });
        }

        const existMenu = await menuModel.findOne({
            url: url.trim(),
            isDeleted: { $ne: true },
        });
        if (existMenu) {
            return res.status(400).json({
                status: "error",
                message: "Menu with this url already exists",
            });
        }

        if (parent_id) {
            const parent = await menuModel.findOne({
                _id: parent_id,
                isDeleted: { $ne: true },
            });
            if (!parent) {
                return res.status(404).json({
                    status: "error",
                    message: "Parent menu not found",
                });
            }
        }

        const menu = await menuModel.create({
            title: title.trim(),
            url: url.trim(),
            parent_id: parent_id || null,
            sort_order: sort_order || 0,
            position: position || "header",
            status: status !== undefined ? status : true,
        });

        return res.status(201).json({
            status: "success",
            message: "Menu created successfully",
            data: menu,
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
        const { title, url, parent_id, sort_order, position, status } = req.body;

        const menu = await menuModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!menu) {
            return res.status(404).json({
                status: "error",
                message: "Menu not found",
            });
        }

        const updateData = {};

        if (url !== undefined) {
            const existMenu = await menuModel.findOne({
                _id: { $ne: id },
                url: url.trim(),
                isDeleted: { $ne: true },
            });

            if (existMenu) {
                return res.status(400).json({
                    status: "error",
                    message: "Menu url already exists",
                });
            }

            updateData.url = url.trim();
        }

        if (title !== undefined) {
            updateData.title = title.trim();
        }

        if (parent_id !== undefined) {
            if (parent_id) {
                if (parent_id === id) {
                    return res.status(400).json({
                        status: "error",
                        message: "Menu cannot be its own parent",
                    });
                }
                const parent = await menuModel.findOne({
                    _id: parent_id,
                    isDeleted: { $ne: true },
                });
                if (!parent) {
                    return res.status(404).json({
                        status: "error",
                        message: "Parent menu not found",
                    });
                }
                updateData.parent_id = parent_id;
            } else {
                updateData.parent_id = null;
            }
        }

        if (sort_order !== undefined) {
            updateData.sort_order = sort_order;
        }

        if (position !== undefined) {
            updateData.position = position;
        }

        if (status !== undefined) {
            updateData.status = status;
        }

        const updatedMenu = await menuModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Menu updated successfully",
            data: updatedMenu,
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
        const menu = await menuModel.findOneAndUpdate(
            { _id: id, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        );

        if (!menu) {
            return res.status(404).json({
                status: "error",
                message: "Menu not found",
            });
        }

        await menuModel.updateMany({ parent_id: id }, { isDeleted: true });

        return res.status(200).json({
            status: "success",
            message: "Menu deleted successfully",
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
        const menu = await menuModel.findOne({ _id: id, isDeleted: { $ne: true } });
        if (!menu) {
            return res.status(404).json({
                status: "error",
                message: "Menu not found",
            });
        }

        menu.status = !menu.status;
        await menu.save();

        return res.status(200).json({
            status: "success",
            message: `Menu status updated to ${menu.status ? "Active" : "Inactive"}`,
            data: menu,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getPublicMenus = async (req, res) => {
    try {
        const query = { status: true, isDeleted: { $ne: true } };
        if (req.query.position) {
            query.position = req.query.position;
        }

        const menus = await menuModel
            .find(query)
            .sort({ sort_order: 1, createdAt: -1 })
            .populate("parent_id", "title url");

        return res.status(200).json({
            status: "success",
            message: "Get public menus successfully",
            data: menus,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
