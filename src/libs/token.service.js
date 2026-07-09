const tokenModel = require("../apps/models/tokens");

exports.storeUserToken = async (userId, accessToken, refreshToken) => {
    const token = await tokenModel.findOne({ userId });
    if (token) {
        await tokenModel.deleteOne({ userId });
    }
    await tokenModel({
        userId,
        accessToken,
        refreshToken,
    }).save();
};

exports.deleteUserToken = async (userId) => {
    const token = await tokenModel.findOne({ userId });
    if (!token) {
        return;
    }
    await tokenModel.deleteOne({ userId });
};
