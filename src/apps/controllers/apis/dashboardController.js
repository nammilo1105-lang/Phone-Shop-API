const userModel = require("../../models/users");
const productModel = require("../../models/products");
const orderModel = require("../../models/orders");

exports.getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            revenueAgg,
            ordersByStatus,
            monthlyRevenue,
            topProducts,
            recentOrders,
        ] = await Promise.all([
            userModel.countDocuments(),
            productModel.countDocuments(),
            orderModel.countDocuments({ status: { $ne: "Cancelled" } }),
            orderModel.aggregate([
                { $match: { status: { $ne: "Cancelled" } } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
            orderModel.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            orderModel.aggregate([
                { $match: { status: { $ne: "Cancelled" } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        revenue: { $sum: "$totalPrice" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": -1, "_id.month": -1 } },
                { $limit: 6 },
            ]),
            orderModel.aggregate([
                { $match: { status: { $ne: "Cancelled" } } },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.productId",
                        productName: { $first: "$items.productName" },
                        totalSold: { $sum: "$items.qty" },
                        revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
                    },
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 },
            ]),
            orderModel
                .find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("orderCode fullName totalPrice status paymentStatus createdAt"),
        ]);

        return res.status(200).json({
            status: "success",
            message: "Get dashboard stats successfully",
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: revenueAgg[0]?.total || 0,
                ordersByStatus: ordersByStatus.map((item) => ({
                    status: item._id,
                    count: item.count,
                })),
                monthlyRevenue: monthlyRevenue.map((item) => ({
                    year: item._id.year,
                    month: item._id.month,
                    revenue: item.revenue,
                    orders: item.orders,
                })),
                topProducts,
                recentOrders,
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
