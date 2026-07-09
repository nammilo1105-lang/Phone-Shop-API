const jwt = require("jsonwebtoken");
const userModel = require("../models/users")
const config = require("config")
exports.verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) {
            req.user = null;
            return next()
        }
        jwt.verify(token, config.get("app.jwtAccessKey"), async (err, decode) => {
            if(err) {
                return next()
            }
            const user = await userModel.findById(decode.id).select("-password")
            req.user = user || null
            return next()
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        })
    }
}