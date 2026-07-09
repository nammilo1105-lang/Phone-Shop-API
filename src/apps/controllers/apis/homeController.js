const sliderModel = require("../../models/sliders");
const categoryModel = require("../../models/category");
const productModel = require("../../models/products");
const brandModel = require("../../models/brands");

exports.getHome = async (req, res) => {
    try {
        const [sliders, categories, newestProducts, favoriteProducts, brands] = await Promise.all([
            sliderModel.find({ status: true, isDeleted: { $ne: true } }).sort({ sort_order: 1, createdAt: -1 }),
            categoryModel.find({ isActive: true }).sort({ order: 1 }),
            productModel.find({ status: true })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("categoryId", "name slug")
                .populate("brandId", "name country"),
            productModel.find({ status: true })
                .sort({ favoriteCount: -1 })
                .limit(10)
                .populate("categoryId", "name slug")
                .populate("brandId", "name country"),
            brandModel.find({ isActive: true }).sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            status: "success",
            message: "Get home data successfully",
            data: {
                sliders,
                categories,
                newestProducts,
                favoriteProducts,
                brands,
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
