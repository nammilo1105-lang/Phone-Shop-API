const favoriteModel = require("../../models/favorites");
const productModel = require("../../models/products");
const paginate = require("../../../libs/paginate");

const mongoose = require("mongoose");

exports.findAll = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        let matchStage = { userId: userObjectId };

        let pipeline = [
            { $match: matchStage }
        ];

        // Join with products collection
        pipeline.push({
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "productDoc"
            }
        });
        pipeline.push({ $unwind: "$productDoc" });

        // Filter out inactive products
        let productMatch = { "productDoc.status": true };

        // brand_id filter
        if (req.query.brand_id) {
            const brandIds = req.query.brand_id.split(",").filter(Boolean);
            const brandObjectIds = brandIds.map(id => new mongoose.Types.ObjectId(id));
            productMatch["productDoc.brand_id"] = brandObjectIds.length === 1 ? brandObjectIds[0] : { $in: brandObjectIds };
        }

        // ram filter
        if (req.query.ram) {
            const rams = req.query.ram.split(",").filter(Boolean);
            productMatch["productDoc.ram"] = rams.length === 1 ? rams[0] : { $in: rams };
        }

        // rom filter
        if (req.query.rom) {
            const roms = req.query.rom.split(",").filter(Boolean);
            productMatch["productDoc.rom"] = roms.length === 1 ? roms[0] : { $in: roms };
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            productMatch["productDoc.price"] = {};
            if (req.query.minPrice) productMatch["productDoc.price"].$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) productMatch["productDoc.price"].$lte = Number(req.query.maxPrice);
        }

        // Keyword search
        if (req.query.keyword) {
            productMatch.$or = [
                { "productDoc.name": { $regex: req.query.keyword, $options: "i" } },
                { "productDoc.description": { $regex: req.query.keyword, $options: "i" } }
            ];
        }

        pipeline.push({ $match: productMatch });

        // Count total items for pagination using a separate aggregate call
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await favoriteModel.aggregate(countPipeline);
        const totalItems = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalItems / limit);

        // Lookup category and brand inside productDoc (Populate equivalent)
        pipeline.push({
            $lookup: {
                from: "category",
                localField: "productDoc.category_id",
                foreignField: "_id",
                as: "productDoc.category_id"
            }
        });
        pipeline.push({
            $unwind: {
                path: "$productDoc.category_id",
                preserveNullAndEmptyArrays: true
            }
        });

        pipeline.push({
            $lookup: {
                from: "brands",
                localField: "productDoc.brand_id",
                foreignField: "_id",
                as: "productDoc.brand_id"
            }
        });
        pipeline.push({
            $unwind: {
                path: "$productDoc.brand_id",
                preserveNullAndEmptyArrays: true
            }
        });

        // Sort stage
        let sort = { createdAt: -1 }; // default is when user favorited
        switch (req.query.sort) {
            case "priceAsc":
            case "price-asc":
                sort = { "productDoc.price": 1 };
                break;
            case "priceDesc":
            case "price-desc":
                sort = { "productDoc.price": -1 };
                break;
            case "sold":
            case "hot":
                sort = { "productDoc.soldCount": -1 };
                break;
            case "favorite":
            case "featured":
                sort = { "productDoc.favoriteCount": -1 };
                break;
            case "rating":
                sort = { "productDoc.averageRating": -1 };
                break;
            case "newest":
            case "new":
                sort = { "productDoc.createdAt": -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }
        pipeline.push({ $sort: sort });

        // Skip & Limit
        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limit });

        // Project stage to map back to { _id, userId, productId: productDoc, createdAt, updatedAt }
        pipeline.push({
            $project: {
                _id: 1,
                userId: 1,
                createdAt: 1,
                updatedAt: 1,
                productId: "$productDoc"
            }
        });

        const favorites = await favoriteModel.aggregate(pipeline);

        const next = page + 1;
        const prev = page - 1;
        const hasNext = next <= totalPages;
        const hasPrev = prev > 0;

        return res.status(200).json({
            status: "success",
            message: "Get favorites successfully",
            data: favorites,
            pages: {
                page,
                limit,
                total: totalPages,
                next,
                prev,
                hasNext,
                hasPrev
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.add = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        const existFavorite = await favoriteModel.findOne({ userId, productId });
        if (existFavorite) {
            return res.status(400).json({
                status: "error",
                message: "Product already favorited",
            });
        }

        const favorite = await favoriteModel.create({
            userId,
            productId,
        });

        // Increment favoriteCount on product
        await productModel.findByIdAndUpdate(productId, { $inc: { favoriteCount: 1 } });

        return res.status(201).json({
            status: "success",
            message: "Product added to favorites successfully",
            data: favorite,
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
        const userId = req.user._id;
        const { productId } = req.params;

        const favorite = await favoriteModel.findOneAndDelete({ userId, productId });
        if (!favorite) {
            return res.status(404).json({
                status: "error",
                message: "Product not found in favorites",
            });
        }

        // Decrement favoriteCount on product
        await productModel.findByIdAndUpdate(productId, {
            $inc: { favoriteCount: -1 }
        });

        return res.status(200).json({
            status: "success",
            message: "Product removed from favorites successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
