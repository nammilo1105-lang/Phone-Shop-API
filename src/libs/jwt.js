const jwt = require("jsonwebtoken")
const config = require("config")
exports.generateAccessToken = async (payload) => 
    await jwt.sign(
        {
            id: payload.id || payload._id,
            email: payload.email
        },
        config.get("app.jwtAccessKey"),
        {expiresIn: "1h"}
    )
exports.generateRefreshToken = async (payload) => 
    await jwt.sign(
        {
            id: payload.id || payload._id,
            email: payload.email
        },
        config.get("app.jwtRefreshKey"),
        {expiresIn: "2d"}
    )