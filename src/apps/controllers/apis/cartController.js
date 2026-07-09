const cartModel = require("../../models/carts");
const productModel = require("../../models/products");

const getCartData = (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
        return {
            cartItems: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    }

    let totalQuantity = 0;
    let totalPrice = 0;
    const cartItems = [];

    for (const item of cart.items) {
        if (item.productId) {
            const qty = item.quantity;
            totalQuantity += qty;
            totalPrice += item.productId.price * qty;
            cartItems.push({
                productId: item.productId,
                quantity: qty,
            });
        }
    }

    return {
        cartItems,
        totalQuantity,
        totalPrice,
    };
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId }).populate("items.productId");
        
        return res.status(200).json({
            status: "success",
            message: "Get cart successfully",
            data: getCartData(cart),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({
                status: "error",
                message: `Only ${product.quantity} items left in stock`,
            });
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = await cartModel.create({
                userId,
                items: [{ productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId.toString()
            );

            if (itemIndex > -1) {
                const newQty = cart.items[itemIndex].quantity + Number(quantity);
                if (product.quantity < newQty) {
                    return res.status(400).json({
                        status: "error",
                        message: `Cannot add more. Only ${product.quantity} items in stock.`,
                    });
                }
                cart.items[itemIndex].quantity = newQty;
            } else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        }

        const populatedCart = await cartModel.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            status: "success",
            message: "Product added to cart successfully",
            data: getCartData(populatedCart),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || Number(quantity) < 1) {
            return res.status(400).json({
                status: "error",
                message: "Quantity must be at least 1",
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({
                status: "error",
                message: `Only ${product.quantity} items left in stock`,
            });
        }

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                status: "error",
                message: "Product not in cart",
            });
        }

        cart.items[itemIndex].quantity = Number(quantity);
        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            status: "success",
            message: "Cart item quantity updated successfully",
            data: getCartData(populatedCart),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: productId } = req.params;

        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );
        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            status: "success",
            message: "Product removed from cart successfully",
            data: getCartData(populatedCart),
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartModel.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            status: "success",
            message: "Cart cleared successfully",
            data: {
                cartItems: [],
                totalQuantity: 0,
                totalPrice: 0,
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