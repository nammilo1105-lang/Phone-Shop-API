const jwt = require("jsonwebtoken");
const config = require("config");

const userModel = require("../models/users");
const tokenModel = require("../models/tokens")
exports.verifyAccessToken = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Access token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Access token is required"
            });
        }

        // Check blacklist
        

        // if (isBlacklisted) {
        //     return res.status(401).json({
        //         status: "error",
        //         message: "Access token has been revoked"
        //     });
        // }

        const decoded = jwt.verify(
            token,
            config.get("app.jwtAccessKey")
        );

        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User not found"
            });
        }

        if (!user.status) {
            return res.status(401).json({
                status: "error",
                message: "Account has been locked"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: "error",
                message: "Access token expired"
            });
        }

        return res.status(401).json({
            status: "error",
            message: "Invalid access token"
        });
    }
};
exports.verifyRefreshToken = async (req, res, next) => {
    try {

        const refreshToken =
            req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: "error",
                message: "Refresh token is required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.get("app.jwtRefreshKey")
        );

        const tokenDoc = await tokenModel.findOne({
            userId: decoded.id,
            refreshToken
        });

        if (!tokenDoc) {
            return res.status(401).json({
                status: "error",
                message: "Refresh token invalid"
            });
        }

        req.decoded = decoded;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: "error",
                message: "Refresh token expired"
            });
        }

        return res.status(401).json({
            status: "error",
            message: "Invalid refresh token"
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({
        status: "error",
        message: "Access denied. Admin role required."
    });
};