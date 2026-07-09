const newsModel = require("../../models/news.model");
const paginate = require("../../../libs/paginate");

const buildQuery = (req, onlyActive = false) => {
    const query = {};

    if (onlyActive) {
        query.status = true;
    } else if (req.query.status !== undefined) {
        query.status = req.query.status === "true";
    }

    if (req.query.keyword) {
        query.$or = [
            { title: { $regex: req.query.keyword, $options: "i" } },
            { shortDescription: { $regex: req.query.keyword, $options: "i" } },
        ];
    }

    return query;
};

exports.findPublic = async (req, res) => {
    try {
        const query = buildQuery(req, true);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const news = await newsModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            message: "Get news successfully",
            data: news,
            pages: await paginate(page, limit, query, newsModel),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.findPublicDetail = async (req, res) => {
    try {
        const { slug } = req.params;
        const query = { status: true };

        if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            query._id = slug;
        } else {
            query.slug = slug;
        }

        const news = await newsModel.findOneAndUpdate(
            query,
            { $inc: { viewCount: 1 } },
            { new: true }
        );

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Get news detail successfully",
            data: news,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const query = buildQuery(req);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const news = await newsModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            message: "Get admin news successfully",
            data: news,
            pages: await paginate(page, limit, query, newsModel),
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
        const news = await newsModel.findById(id);

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Get admin news detail successfully",
            data: news,
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
        const { title, slug, thumbnail, shortDescription, content, author, status } = req.body;

        const news = await newsModel.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            thumbnail: thumbnail || "",
            shortDescription: shortDescription.trim(),
            content,
            author: author || "Admin",
            status: status !== undefined ? status : true,
        });

        return res.status(201).json({
            status: "success",
            message: "Create news successfully",
            data: news,
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
        const { title, slug, thumbnail, shortDescription, content, author, status } = req.body;

        const news = await newsModel.findById(id);
        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        const updateData = {
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            thumbnail: thumbnail || "",
            shortDescription: shortDescription.trim(),
            content,
            author: author || "Admin",
            status: status !== undefined ? status : true,
        };

        const updatedNews = await newsModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            status: "success",
            message: "Update news successfully",
            data: updatedNews,
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
        const news = await newsModel.findByIdAndDelete(id);

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Delete news successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
