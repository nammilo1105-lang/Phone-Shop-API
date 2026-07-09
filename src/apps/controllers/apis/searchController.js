const productModel = require("../../models/products");
const categoryModel = require("../../models/category");
const brandModel = require("../../models/brands");
const paginate = require("../../../libs/paginate");
const mongoose = require("mongoose");

exports.search = async (req, res) => {
    try {
        const query = { status: true };

        if (req.query.keyword) {
            query.$or = [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { description: { $regex: req.query.keyword, $options: "i" } }
            ];
        }

        if (req.query.category) {
            if (mongoose.Types.ObjectId.isValid(req.query.category)) {
                query.categoryId = req.query.category;
            } else {
                const cat = await categoryModel.findOne({ slug: req.query.category });
                if (cat) {
                    query.categoryId = cat._id;
                } else {
                    return res.status(200).json({
                        status: "success",
                        message: "Search completed successfully",
                        data: [],
                        pages: {
                            page: 1,
                            limit: Number(req.query.limit) || 10,
                            total: 0,
                            next: 2,
                            prev: 0,
                            hasNext: false,
                            hasPrev: false
                        }
                    });
                }
            }
        }

        if (req.query.brand) {
            if (mongoose.Types.ObjectId.isValid(req.query.brand)) {
                query.brandId = req.query.brand;
            } else {
                const br = await brandModel.findOne({ name: { $regex: `^${req.query.brand}$`, $options: "i" } });
                if (br) {
                    query.brandId = br._id;
                } else {
                    return res.status(200).json({
                        status: "success",
                        message: "Search completed successfully",
                        data: [],
                        pages: {
                            page: 1,
                            limit: Number(req.query.limit) || 10,
                            total: 0,
                            next: 2,
                            prev: 0,
                            hasNext: false,
                            hasPrev: false
                        }
                    });
                }
            }
        }

        if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
            query.price = {};
            if (req.query.minPrice !== undefined) {
                query.price.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice !== undefined) {
                query.price.$lte = Number(req.query.maxPrice);
            }
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const products = await productModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("categoryId", "name slug")
            .populate("brandId", "name country");

        return res.status(200).json({
            status: "success",
            message: "Search completed successfully",
            data: products,
            pages: await paginate(page, limit, query, productModel),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
