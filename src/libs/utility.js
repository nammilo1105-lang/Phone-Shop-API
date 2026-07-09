const jwt = require("jsonwebtoken");
const config = require("config");

const signJwt = (payload) => {
    return jwt.sign(payload, config.get("app.jwtSecret"), { expiresIn: "7d" });
};

const verifyJwt = (token) => {
    return jwt.verify(token, config.get("app.jwtSecret"));
};

module.exports = { signJwt, verifyJwt };