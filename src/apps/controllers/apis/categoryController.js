const categoryModel = require("../../models/category");
const slugify = require("slugify");

exports.getAll = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ order: 1 });
        return res.status(200).json({
            status: "success",
            message: "Get categories successfully",
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Get category successfully",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        
        const slug = slugify(name, {
            lower: true,
            strict: true,
            locale: "vi"
        });

        const existCategory = await categoryModel.findOne({
            $or: [
                { name: { $regex: `^${name.trim()}$`, $options: "i" } },
                { slug }
            ]
        });

        if (existCategory) {
            return res.status(400).json({
                status: "error",
                message: "Category with this name or slug already exists"
            });
        }

        const highestOrderCategory = await categoryModel.findOne().sort({ order: -1 });
        const orderCategory = highestOrderCategory ? highestOrderCategory.order + 1 : 1;

        const category = await categoryModel.create({
            name: name.trim(),
            slug,
            order: orderCategory
        });

        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, order, isActive } = req.body;

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }

        const updateData = {};
        if (name !== undefined) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
                locale: "vi"
            });

            const existCategory = await categoryModel.findOne({
                _id: { $ne: id },
                $or: [
                    { name: { $regex: `^${name.trim()}$`, $options: "i" } },
                    { slug }
                ]
            });

            if (existCategory) {
                return res.status(400).json({
                    status: "error",
                    message: "Category with this name or slug already exists"
                });
            }

            updateData.name = name.trim();
            updateData.slug = slug;
        }

        if (order !== undefined) {
            updateData.order = order;
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            data: updatedCategory
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};