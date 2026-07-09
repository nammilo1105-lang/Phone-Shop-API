const mongoose = require("../../common/init.mongo")();

const productSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
      index: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    gallery: {
      type: [String],
      default: [],
    },

    colors: {
      type: [
        {
          name: { type: String, trim: true },
          code: { type: String, trim: true },
          gallery: { type: [String], default: [] },
        },
      ],
      default: [],
    },

    variants: {
      type: [
        {
          sku: { type: String, trim: true },
          name: { type: String, trim: true },
          price: { type: Number, default: 0, min: 0 },
          stock: { type: Number, default: 0, min: 0 },
        },
      ],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    condition: {
      type: String,
      default: "",
      trim: true,
    },

    accessories: {
      type: String,
      default: "",
      trim: true,
    },

    promotion: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    cpu: {
      type: String,
      default: "",
    },

    ram: {
      type: String,
      default: "",
    },

    rom: {
      type: String,
      default: "",
    },

    screen: {
      type: String,
      default: "",
    },

    battery: {
      type: String,
      default: "",
    },

    cameraRear: {
      type: String,
      default: "",
    },

    cameraFront: {
      type: String,
      default: "",
    },

    operatingSystem: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    favoriteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const productModel = mongoose.model("Products", productSchema, "products");

module.exports = productModel;
