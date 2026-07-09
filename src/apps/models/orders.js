const mongoose = require("../../common/init.mongo")();

const orderSchema = new mongoose.Schema(
    {
        orderCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: false,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                    required: true,
                },

                productName: {
                    type: String,
                    required: true,
                    trim: true,
                },

                thumbnail: {
                    type: String,
                    default: "",
                },

                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                color: {
                    type: String,
                    default: "",
                    trim: true,
                },
            },
        ],

        shippingFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "VNPAY", "MOMO", "BANKING"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Unpaid", "Paid", "Refunded"],
            default: "Unpaid",
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Shipping",
                "Completed",
                "Cancelled",
            ],
            default: "Pending",
        },

        note: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const orderModel = mongoose.model(
    "Orders",
    orderSchema,
    "orders"
);

module.exports = orderModel;