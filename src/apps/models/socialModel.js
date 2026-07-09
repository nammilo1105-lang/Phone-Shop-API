const mongoose = require("../../common/init.mongo")();

const socialUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["google", "facebook"],
      required: true,
      trim: true,
    },

    providerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const socialUserModel = mongoose.model(
  "SocialUser",
  socialUserSchema,
  "social_users"
);

module.exports = socialUserModel;