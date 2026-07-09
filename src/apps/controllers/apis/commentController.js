const commentModel = require("../../models/comments");
const productModel = require("../../models/products");
const paginate = require("../../../libs/paginate");

const updateProductRating = async (productId) => {
    const comments = await commentModel.find({ productId, rating: { $ne: null }, status: true });
    if (comments.length > 0) {
        const sum = comments.reduce((acc, c) => acc + c.rating, 0);
        const avg = Math.round((sum / comments.length) * 10) / 10;
        await productModel.findByIdAndUpdate(productId, { averageRating: avg });
    } else {
        await productModel.findByIdAndUpdate(productId, { averageRating: 0 });
    }
};

exports.findAll = async (req, res) => {
    try {
        const query = {};
        if (req.query.status !== undefined) {
            query.status = req.query.status === "true";
        }
        if (req.query.productId) {
            query.productId = req.query.productId;
        }
        if (req.query.keyword) {
            query.content = { $regex: req.query.keyword, $options: "i" };
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const comments = await commentModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("userId", "fullName email role")
            .populate("productId", "name thumbnail");

        return res.status(200).json({
            status: "success",
            message: "Get comments successfully",
            data: comments,
            pages: await paginate(page, limit, query, commentModel),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.findByIdProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await commentModel
            .find({ productId, status: true })
            .populate("userId", "fullName role")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: "success",
            message: "Get comments successfully",
            data: comments,
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
        const { productId, content, rating, parentId } = req.body;
        const userId = req.user._id;

        if (!productId || !content) {
            return res.status(400).json({
                status: "error",
                message: "Product ID and content are required",
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        if (parentId) {
            const parentComment = await commentModel.findById(parentId);
            if (!parentComment) {
                return res.status(404).json({
                    status: "error",
                    message: "Parent comment not found",
                });
            }
        }

        const newComment = await commentModel.create({
            userId,
            productId,
            content,
            rating: parentId ? null : rating,
            parentId: parentId || null,
        });

        if (rating && !parentId) {
            await updateProductRating(productId);
        }

        const populatedComment = await newComment.populate("userId", "fullName role");

        return res.status(201).json({
            status: "success",
            message: "Comment created successfully",
            data: populatedComment,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.approve = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Only admins can approve/toggle comment status",
            });
        }

        const comment = await commentModel.findById(id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "Comment not found",
            });
        }

        comment.status = typeof status === "boolean" ? status : !comment.status;
        await comment.save();

        if (comment.rating) {
            await updateProductRating(comment.productId);
        }

        return res.status(200).json({
            status: "success",
            message: `Comment status updated to ${comment.status ? "Active" : "Inactive"}`,
            data: comment,
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
        const comment = await commentModel.findById(id);

        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "Comment not found",
            });
        }

        if (req.user.role !== "admin" && comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: "error",
                message: "Access denied",
            });
        }

        await commentModel.findByIdAndDelete(id);

        if (comment.rating) {
            await updateProductRating(comment.productId);
        }

        await commentModel.deleteMany({ parentId: id });

        return res.status(200).json({
            status: "success",
            message: "Comment deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
