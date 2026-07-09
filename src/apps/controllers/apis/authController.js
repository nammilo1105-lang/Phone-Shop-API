const bcrypt = require("bcrypt");

const userModel = require("../../models/users");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../../libs/jwt");
const {storeUserToken, deleteUserToken} = require("../../../libs/token.service")

// const { signJwt } = require("../../../libs/utility");
const axios = require("axios");
// const sendMail = require("../../emails/email");
exports.register = async (req, res) => {
    try {

        const {
            fullName,
            email,
            password,
            phone,
            address,
        } = req.body;

        const isEmail = await userModel.findOne({
            email,
        });

        if (isEmail) {
            return res.status(400).json({
                status: "error",
                message: "Email already exists",
            });
        }

        const isPhone = await userModel.findOne({
            phone,
        });

        if (isPhone) {
            return res.status(400).json({
                status: "error",
                message: "Phone already exists",
            });
        }

        const hashPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashPassword,
            phone,
            address,
            role: "user",
        });

        // Optional send email
        /*
        await sendMail(
            `${config.get("mail.mailTemplate")}/register.ejs`,
            {
                fullName,
                email,
                subject: "Đăng ký tài khoản thành công"
            }
        );
        */

        const { password: pwd, ...other } =
            newUser.toObject();

        return res.status(201).json({
            status: "success",
            message: "Register successfully",
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

exports.login = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;

        const user = await userModel.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Email not found",
            });
        }

        if (!user.status) {
            return res.status(403).json({
                status: "error",
                message: "Account has been locked",
            });
        }

        const isPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPassword) {
            return res.status(400).json({
                status: "error",
                message: "Incorrect password",
            });
        }

        const accessToken =
            await generateAccessToken(user);

        const refreshToken =
            await generateRefreshToken(user);

        const { password: pmd, ...other } =
            user.toObject();

        await storeUserToken(
            other._id,
            accessToken,
            refreshToken
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge:
                    30 * 24 * 60 * 60 * 1000,
            }
        );

        return res.status(200).json({
            status: "success",
            message: "Login successfully",
            data: other,
            accessToken,
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });

    }
};

exports.logout = async (req, res) => {
    try {

        const { user } = req;

        // await addTokenBlacklist(
        //     user._id
        // );

        await deleteUserToken(
            user.id
        );

        res.clearCookie("refreshToken");

        return res.status(200).json({
            status: "success",
            message: "Logout successfully",
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });

    }
};

exports.refreshToken = async (req, res) => {
    try {

        const { decoded } = req;

        const user =
            await userModel.findById(
                decoded.id
            );

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        const accessToken =
            await generateAccessToken(
                user
            );

        return res.status(200).json({
            status: "success",
            message:
                "Access token generated successfully",
            accessToken,
        });

    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });

    }
};

exports.getMe = async (req, res) => {
    try {

        const { user } = req;

        return res.status(200).json({
            status: "success",
            message:
                "User profile retrieved successfully",
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



exports.googleLogin = async (req, res) => {
  try {
    const { accessToken: googleAccessToken } = req.body;
    if (!googleAccessToken)
      return res
        .status(400)
        .json({ status: "error", message: "Access token is required" });

    // 1. Lấy profile từ Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleAccessToken}`
    );
    const profile = response.data;

    // 2. Kiểm tra hoặc tạo user trong bảng users (dùng chung với đăng nhập thường)
    let user = await userModel.findOne({
      $or: [
        { provider: "google", providerId: profile.id },
        { email: profile.email },
      ],
    });

    if (!user) {
      user = await userModel.create({
        fullName: profile.name || "Google user",
        email: profile.email,
        provider: "google",
        providerId: profile.id,
        avatar: profile.picture || "",
      });
    }

    // 3. Tạo JWT — dùng chung generateAccessToken/generateRefreshToken với login
    //    thường (KHÔNG dùng signJwt vì nó ký bằng secret khác với jwtAccessKey
    //    mà verifyAccessToken dùng để verify, gây lỗi 401 invalid signature)
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await storeUserToken(user._id, accessToken, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 4. Trả về response
    return res.status(200).json({
      status: "success",
      message: "google login successfully",
      data: { user, token: accessToken },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.facebookLogin = async (req, res) => {
  try {
    const { accessToken: fbAccessToken } = req.body;
    if (!fbAccessToken)
      return res
        .status(400)
        .json({ status: "error", message: "Access token is required" });

    // 1. Lấy profile từ Facebook
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${fbAccessToken}`
    );
    const profile = response.data;

    // 2. Kiểm tra hoặc tạo user trong bảng users (dùng chung với đăng nhập thường)
    let user = await userModel.findOne({
      $or: [
        { provider: "facebook", providerId: profile.id },
        { email: profile.email },
      ],
    });

    if (!user) {
      user = await userModel.create({
        fullName: profile.name || "Facebook user",
        email: profile.email,
        provider: "facebook",
        providerId: profile.id,
        avatar: profile.picture?.data?.url || "",
      });
    }

    // 3. Tạo JWT — dùng chung generateAccessToken/generateRefreshToken với login
    //    thường (KHÔNG dùng signJwt vì nó ký bằng secret khác)
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await storeUserToken(user._id, accessToken, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 4. Trả về response
    return res.status(200).json({
      status: "success",
      message: "login facebook successfully",
      data: { user, token: accessToken },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};