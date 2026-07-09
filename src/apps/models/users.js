const mongoose = require("../../common/init.mongo")();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    status: {
      type: Boolean,
      default: true,
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const userModel = mongoose.model("Users", userSchema, "users");

module.exports = userModel;
