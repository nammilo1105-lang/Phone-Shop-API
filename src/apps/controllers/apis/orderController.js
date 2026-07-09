const orderModel = require("../../models/orders");
const productModel = require("../../models/products");
const paginate = require("../../../libs/paginate");
const sendMail = require("../../../emails/mail");
const config = require("config");

exports.findAll = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const query = {};
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    } else {
      if (req.query.userId) {
        query.userId = req.query.userId;
      }
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;

    const orders = await orderModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    // .populate("userId", "fullName email phone role");

    return res.status(200).json({
      status: "success",
      message: "Get orders successfully",
      data: orders,
      pages: await paginate(page, limit, query, orderModel),
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
    const order = await orderModel
      .findById(id)
      .populate("userId", "fullName email phone role");
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      if (
        !order.userId ||
        order.userId._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          status: "error",
          message: "Access denied",
        });
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Get order successfully",
      data: order,
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
    const {
      fullName,
      email,
      phone,
      address,
      items,
      shippingFee = 0,
      discount = 0,
      paymentMethod = "COD",
      note = "",
    } = req.body;

    // const orderUser = req.user;
    // const finalFullName = fullName || (orderUser ? orderUser.fullName : null);
    // const finalEmail = email || (orderUser ? orderUser.email : null);
    // const finalPhone = phone || (orderUser ? orderUser.phone : null);
    // const finalAddress = address || (orderUser ? orderUser.address : null);

    // if (!finalFullName || !finalEmail || !finalPhone || !finalAddress) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "fullName, email, phone, and address are required",
    //   });
    // }
    let infoUser = {};
    const user = req.user;
    if (req.user) {
      infoUser = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      };
    } else {
      const { fullName, email, phone, address } = req.body;
      infoUser = { fullName, email, phone, address };
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Order items are required",
      });
    }

    const generateOrderCode = async () => {
      const year = new Date().getFullYear();
      let code;
      let exists = true;
      while (exists) {
        const random = Math.floor(100000 + Math.random() * 900000);
        code = `ORD${year}${random}`;
        const found = await orderModel.findOne({ orderCode: code });
        if (!found) exists = false;
      }
      return code;
    };

    const orderCode = await generateOrderCode();
    const computedItems = [];
    let orderMail = [];
    let subTotal = 0;

    for (const item of items) {
      const requestedQty = Number(item.qty ?? item.quantity ?? 1);
      const productId = item.productId || item.product_id || item.product;

      if (!productId) {
        return res.status(400).json({
          status: "error",
          message: "Product ID is required",
        });
      }

      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: `Product with ID ${productId} not found`,
        });
      }
      if (product.quantity < requestedQty) {
        return res.status(400).json({
          status: "error",
          message: `Sản phẩm ${product.name} không đủ hàng`,
        });
      }

      const itemPrice = product.price;
      subTotal += requestedQty * itemPrice;

      computedItems.push({
        productId: product._id,
        productName: product.name,
        thumbnail: product.thumbnail,
        qty: requestedQty,
        price: product.price,
        color: item.color || item.selectedColor || "",
      });
      orderMail.push({
        name: product.name,
        qty: requestedQty,
        price: itemPrice,
      });

      product.quantity -= requestedQty;
      product.soldCount += requestedQty;
      await product.save();
    }

    const totalPrice = subTotal + Number(shippingFee) - Number(discount);

    const order = await orderModel.create({
      orderCode,
      userId: user ? user._id : null,
      fullName: infoUser.fullName,
      email: infoUser.email,
      phone: infoUser.phone,
      address: infoUser.address,
      items: computedItems,
      shippingFee,
      discount,
      totalPrice: totalPrice < 0 ? 0 : totalPrice,
      paymentMethod,
      paymentStatus: "Unpaid",
      status: "Pending",
      note,
    });

    await sendMail(`${config.get("mail.mailTemplate")}/mail-order.ejs`, {
      payload: {
        fullName: infoUser.fullName,
        phone: infoUser.phone,
        address: infoUser.address,
        email: infoUser.email,
        orderCode,
        shippingFee,
        discount,
        totalPrice: totalPrice < 0 ? 0 : totalPrice,
      },
      items: orderMail,
      subject: `[Hoàng Nam Mobile]xác nhận đơn hàng ${orderCode}`,
    });
    // console.log(payload);
    
    // Send order notification email to admin asynchronously

    return res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: order,
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
    const { status, paymentStatus } = req.body;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      if (
        !order.userId ||
        order.userId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          status: "error",
          message: "Access denied",
        });
      }

      if (status === "Cancelled") {
        if (order.status !== "Pending") {
          return res.status(400).json({
            status: "error",
            message: "Only Pending orders can be cancelled",
          });
        }

        for (const item of order.items) {
          await productModel.findByIdAndUpdate(item.productId, {
            $inc: { quantity: item.qty, soldCount: -item.qty },
          });
        }

        order.status = "Cancelled";
        await order.save();

        return res.status(200).json({
          status: "success",
          message: "Order cancelled successfully",
          data: order,
        });
      } else {
        return res.status(403).json({
          status: "error",
          message:
            "Only admins can update order details or change statuses other than Cancelled",
        });
      }
    }

    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.items) {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.qty, soldCount: -item.qty },
        });
      }
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: order,
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
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only admins can delete orders",
      });
    }

    const order = await orderModel.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { orderCode, phone, email } = req.body;

    if (!orderCode) {
      return res.status(400).json({
        status: "error",
        message: "Order code is required",
      });
    }

    if (!phone && !email) {
      return res.status(400).json({
        status: "error",
        message: "Phone or email is required",
      });
    }

    const order = await orderModel.findOne({ orderCode });
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Verify phone or email matches
    if (phone && order.phone !== phone) {
      return res.status(403).json({
        status: "error",
        message: "Phone number does not match",
      });
    }

    if (email && order.email !== email) {
      return res.status(403).json({
        status: "error",
        message: "Email does not match",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Order found",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
