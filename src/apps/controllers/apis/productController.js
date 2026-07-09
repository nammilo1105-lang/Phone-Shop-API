const paginate = require("../../../libs/paginate");
const slugify = require("slugify");
const productModel = require("../../models/products");
const categoryModel = require("../../models/category");
const brandModel = require("../../models/brands");
exports.findAll = async (req, res) => {
  try {
    const query = {};
    if (req.query.category_id) query.category_id = req.query.category_id;
    // brand_id: hỗ trợ nhiều giá trị phân cách bằng dấu phẩy
    if (req.query.brand_id) {
      const brandIds = req.query.brand_id.split(",").filter(Boolean);
      query.brand_id = brandIds.length === 1 ? brandIds[0] : { $in: brandIds };
    }
    if (req.query.is_featured)
      query.isFeatured = req.query.is_featured === "true";
    if (req.query.status) query.status = req.query.status === "true";
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    // ram filter
    if (req.query.ram) {
      const rams = req.query.ram.split(",").filter(Boolean);
      query.ram = rams.length === 1 ? rams[0] : { $in: rams };
    }
    // rom filter (đã bị thiếu trước đây)
    if (req.query.rom) {
      const roms = req.query.rom.split(",").filter(Boolean);
      query.rom = roms.length === 1 ? roms[0] : { $in: roms };
    }
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }
    let sort = { createdAt: -1 };

    switch (req.query.sort) {
      case "priceAsc":
      case "price-asc":
        sort = { price: 1 };
        break;

      case "priceDesc":
      case "price-desc":
        sort = { price: -1 };
        break;

      case "newest":
      case "new":
        sort = { createdAt: -1 };
        break;

      case "favorite":
      case "featured":
        sort = { favoriteCount: -1 };
        break;

      case "sold":
      case "hot":
        sort = { soldCount: -1 };
        break;

      case "rating":
        sort = { averageRating: -1 };
        break;

      default:
        sort = { createdAt: -1 };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const product = await productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");
    return res.status(200).json({
      status: "success",
      message: "get product successfully",
      data: product,
      pages: await paginate(page, limit, query, productModel),
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
    const product = await productModel
      .findById(id)
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");
    return res.status(200).json({
      status: "success",
      message: "get product successfully",
      data: product,
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
    const {
      category_id,
      brand_id,
      name,
      thumbnail,
      images,
      gallery,
      colors,
      variants,
      stock,
      reviewCount,
      price,
      quantity,
      condition,
      accessories,
      promotion,
      description,
      cpu,
      ram,
      rom,
      screen,
      battery,
      cameraRear,
      cameraFront,
      operatingSystem,
      is_featured,
      isFeatured,
      status,
    } = req.body;

    // Check category

    const category = await categoryModel.findById(category_id);

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Check brand

    const brand = await brandModel.findById(brand_id);

    if (!brand) {
      return res.status(404).json({
        status: "error",
        message: "Brand not found",
      });
    }

    // Create slug

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "vi",
    });

    // Check product exists

    const existProduct = await productModel.findOne({ slug });

    if (existProduct) {
      return res.status(400).json({
        status: "error",
        message: "Product already exists",
      });
    }

    // Create product

    const product = await productModel.create({
      category_id,
      brand_id,
      name,
      slug,
      thumbnail,
      images,
      gallery,
      colors,
      variants,
      stock,
      reviewCount,
      price,
      quantity,
      condition,
      accessories,
      promotion,
      description,
      cpu,
      ram,
      rom,
      screen,
      battery,
      cameraRear,
      cameraFront,
      operatingSystem,
      isFeatured: isFeatured !== undefined ? isFeatured : is_featured,
      status,
    });

    return res.status(201).json({
      status: "success",
      message: "Create product successfully",
      data: product,
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

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const {
      category_id,
      brand_id,
      name,
      thumbnail,
      images,
      gallery,
      colors,
      variants,
      stock,
      reviewCount,
      price,
      quantity,
      condition,
      accessories,
      promotion,
      description,
      cpu,
      ram,
      rom,
      screen,
      battery,
      cameraRear,
      cameraFront,
      operatingSystem,
      is_featured,
      isFeatured,
      status,
    } = req.body;

    // Check category

    if (category_id) {
      const category = await categoryModel.findById(category_id);

      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }
    }

    // Check brand

    if (brand_id) {
      const brand = await brandModel.findById(brand_id);

      if (!brand) {
        return res.status(404).json({
          status: "error",
          message: "Brand not found",
        });
      }
    }

    // Update slug if name changed

    let slug = product.slug;

    if (name && name !== product.name) {
      slug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
      });

      const existProduct = await productModel.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existProduct) {
        return res.status(400).json({
          status: "error",
          message: "Product name already exists",
        });
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        category_id,
        brand_id,
        name,
        slug,
        thumbnail,
        images,
        gallery,
        colors,
        variants,
        stock,
        reviewCount,
        price,
        quantity,
        condition,
        accessories,
        promotion,
        description,
        cpu,
        ram,
        rom,
        screen,
        battery,
        cameraRear,
        cameraFront,
        operatingSystem,
        isFeatured: isFeatured !== undefined ? isFeatured : is_featured,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      status: "success",
      message: "Update product successfully",
      data: updatedProduct,
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
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Delete product successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const orderModel = require("../../models/orders");

exports.getNewest = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");

    return res.status(200).json({
      status: "success",
      message: "Get top newest products successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: true })
      .sort({ favoriteCount: -1 })
      .limit(12)
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");

    return res.status(200).json({
      status: "success",
      message: "Get top favorited products successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const bestSellersAgg = await orderModel.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $group: { _id: "$items.productId", totalSold: { $sum: "$items.qty" } },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 12 },
    ]);

    const productIds = bestSellersAgg.map((item) => item._id);

    let products = await productModel
      .find({ _id: { $in: productIds }, status: true })
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");

    products = products.sort((a, b) => {
      const aSold =
        bestSellersAgg.find((item) => item._id.toString() === a._id.toString())
          ?.totalSold || 0;
      const bSold =
        bestSellersAgg.find((item) => item._id.toString() === b._id.toString())
          ?.totalSold || 0;
      return bSold - aSold;
    });

    if (products.length < 12) {
      const remainingCount = 12 - products.length;
      const fallbackProducts = await productModel
        .find({ _id: { $nin: productIds }, status: true })
        .sort({ soldCount: -1 })
        .limit(remainingCount)
        .populate("category_id", "name slug")
        .populate("brand_id", "name country");

      products = [...products, ...fallbackProducts];
    }

    return res.status(200).json({
      status: "success",
      message: "Get top best seller products successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query — bắt buộc lọc theo category_id
    const query = { category_id: id };

    // brand_id: hỗ trợ nhiều giá trị phân cách bằng dấu phẩy
    if (req.query.brand_id) {
      const brandIds = req.query.brand_id.split(",").filter(Boolean);
      query.brand_id = brandIds.length === 1 ? brandIds[0] : { $in: brandIds };
    }

    // RAM filter
    if (req.query.ram) {
      const rams = req.query.ram.split(",").filter(Boolean);
      query.ram = rams.length === 1 ? rams[0] : { $in: rams };
    }

    // ROM filter
    if (req.query.rom) {
      const roms = req.query.rom.split(",").filter(Boolean);
      query.rom = roms.length === 1 ? roms[0] : { $in: roms };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Keyword search
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    // Sort
    let sort = { createdAt: -1 };
    switch (req.query.sort) {
      case "priceAsc":
      case "price-asc":
        sort = { price: 1 };
        break;
      case "priceDesc":
      case "price-desc":
        sort = { price: -1 };
        break;
      case "sold":
      case "hot":
        sort = { soldCount: -1 };
        break;
      case "favorite":
      case "featured":
        sort = { favoriteCount: -1 };
        break;
      case "newest":
      case "new":
      default:
        sort = { createdAt: -1 };
    }

    const totalItems = await productModel.countDocuments(query);

    const products = await productModel
      .find(query)
      .populate("category_id", "name slug")
      .populate("brand_id", "name country")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.findBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel
      .findOne({ slug, status: true })
      .populate("category_id", "name slug")
      .populate("brand_id", "name country");

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Get product successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
