const bcrypt = require("bcrypt");
const userModel = require("../../models/users");
const paginate = require("../../../libs/paginate");

exports.findAll = async (req, res) => {
    try {
        const query = {};
        if (req.query.keyword) {
            const keyword = req.query.keyword;
            query.$or = [
                { fullName: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
                { phone: { $regex: keyword, $options: "i" } },
            ];
        }
        if (req.query.role) {
            query.role = req.query.role;
        }
        if (req.query.status !== undefined) {
            query.status = req.query.status === "true";
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = page * limit - limit;

        const users = await userModel
            .find(query)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            message: "Get users successfully",
            data: users,
            pages: await paginate(page, limit, query, userModel),
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
        const user = await userModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Get user successfully",
            data: user,
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
        const { fullName, email, password, phone, address, role, status } = req.body;

        const isEmail = await userModel.findOne({ email });
        if (isEmail) {
            return res.status(400).json({
                status: "error",
                message: "Email already exists",
            });
        }

        if (phone) {
            const isPhone = await userModel.findOne({ phone });
            if (isPhone) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone already exists",
                });
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashPassword,
            phone: phone || "",
            address: address || "",
            role: role || "user",
            status: status !== undefined ? status : true,
        });

        const { password: pwd, ...other } = user.toObject();

        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: other,
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
        const { fullName, email, password, phone, address, role, status } = req.body;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        if (email && email !== user.email) {
            const existEmail = await userModel.findOne({ email });
            if (existEmail) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exists",
                });
            }
            user.email = email;
        }

        if (phone && phone !== user.phone) {
            const existPhone = await userModel.findOne({ phone });
            if (existPhone) {
                return res.status(400).json({
                    status: "error",
                    message: "Phone already exists",
                });
            }
            user.phone = phone;
        }

        if (fullName !== undefined) user.fullName = fullName;
        if (address !== undefined) user.address = address;
        if (role !== undefined) user.role = role;
        if (status !== undefined) user.status = status;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        const { password: pwd, ...other } = user.toObject();

        return res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: other,
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
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                status: "error",
                message: "Cannot delete your own account",
            });
        }

        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                status: "error",
                message: "Cannot lock your own account",
            });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        user.status = !user.status;
        await user.save();

        const { password: pwd, ...other } = user.toObject();

        return res.status(200).json({
            status: "success",
            message: `User status updated to ${user.status ? "Active" : "Locked"}`,
            data: other,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};
