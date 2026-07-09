const productModel = require("../apps/models/products");

/**
 * Tìm kiếm sản phẩm theo tên
 */
exports.searchByName = async (keyword) => {
  if (!keyword) return [];

  return await productModel
    .find({
      name: {
        $regex: String(keyword),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm sản phẩm còn trong kho
 */
exports.searchStock = async (keyword) => {
  if (!keyword) return [];

  return await productModel
    .find({
      name: {
        $regex: String(keyword),
        $options: "i",
      },
      $or: [
        { stock: { $gt: 0 } },
        { quantity: { $gt: 0 } },
      ],
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm sản phẩm theo giá (từ keyword)
 */
exports.searchByPrice = async (keyword) => {
  if (!keyword) return [];

  return await productModel
    .find({
      name: {
        $regex: String(keyword),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm sản phẩm theo hãng
 */
exports.searchByBrand = async (brand) => {
  return await productModel
    .find()
    .populate("brand_id")
    .populate("category_id")
    .then((products) =>
      products.filter(
        (p) =>
          p.brand_id?.name?.toLowerCase().includes(brand.toLowerCase()) &&
          p.status
      )
    );
};

/**
 * Tìm kiếm sản phẩm theo danh mục
 */
exports.searchByCategory = async (category) => {
  return await productModel
    .find()
    .populate("brand_id")
    .populate("category_id")
    .then((products) =>
      products.filter(
        (p) =>
          p.category_id?.name?.toLowerCase().includes(category.toLowerCase()) &&
          p.status
      )
    );
};

/**
 * Tìm kiếm sản phẩm có khuyến mãi
 */
exports.searchPromotion = async () => {
  return await productModel.find({
    promotion: {
      $ne: "",
      $exists: true,
    },
    status: true,
  });
};

/**
 * So sánh 2 sản phẩm
 */
exports.compareProducts = async (name1, name2) => {
  const p1 = await productModel
    .findOne({
      name: {
        $regex: name1,
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");

  const p2 = await productModel
    .findOne({
      name: {
        $regex: name2,
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");

  return {
    p1,
    p2,
  };
};

/**
 * Tìm kiếm theo RAM
 */
exports.searchByRAM = async (ram) => {
  if (!ram) return [];

  return await productModel
    .find({
      ram: {
        $regex: String(ram),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo ROM
 */
exports.searchByROM = async (rom) => {
  if (!rom) return [];

  return await productModel
    .find({
      rom: {
        $regex: String(rom),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo CPU
 */
exports.searchByCPU = async (cpu) => {
  if (!cpu) return [];

  return await productModel
    .find({
      cpu: {
        $regex: String(cpu),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo dung lượng pin
 */
exports.searchByBattery = async (battery) => {
  if (!battery) return [];

  return await productModel
    .find({
      battery: {
        $regex: String(battery),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo camera
 */
exports.searchByCamera = async (camera) => {
  if (!camera) return [];

  return await productModel
    .find({
      $or: [
        { cameraRear: { $regex: String(camera), $options: "i" } },
        { cameraFront: { $regex: String(camera), $options: "i" } },
      ],
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo màn hình
 */
exports.searchByScreen = async (screen) => {
  if (!screen) return [];

  return await productModel
    .find({
      screen: {
        $regex: String(screen),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo màu sắc
 */
exports.searchByColor = async (color) => {
  if (!color) return [];

  return await productModel
    .find({
      "colors.name": {
        $regex: String(color),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo phiên bản
 */
exports.searchByVariant = async (variant) => {
  if (!variant) return [];

  return await productModel
    .find({
      "variants.name": {
        $regex: String(variant),
        $options: "i",
      },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm phụ kiện
 */
exports.searchAccessory = async (keyword) => {
  if (!keyword) {
    // Nếu không có keyword, tìm tất cả phụ kiện
    return await productModel
      .find({
        name: {
          $regex: "phụ kiện|ốp|tai nghe|sạc|cáp|case",
          $options: "i",
        },
        status: true,
      })
      .populate("brand_id")
      .populate("category_id");
  }

  return await productModel
    .find({
      $and: [
        {
          $or: [
            { name: { $regex: "phụ kiện|ốp|tai nghe|sạc|cáp|case", $options: "i" } },
            { description: { $regex: "phụ kiện|ốp|tai nghe|sạc|cáp|case", $options: "i" } },
          ],
        },
        {
          $or: [
            { name: { $regex: String(keyword), $options: "i" } },
            { description: { $regex: String(keyword), $options: "i" } },
            { accessories: { $regex: String(keyword), $options: "i" } },
            { promotion: { $regex: String(keyword), $options: "i" } },
            { cpu: { $regex: String(keyword), $options: "i" } },
            { ram: { $regex: String(keyword), $options: "i" } },
            { rom: { $regex: String(keyword), $options: "i" } },
            { screen: { $regex: String(keyword), $options: "i" } },
            { battery: { $regex: String(keyword), $options: "i" } },
            { cameraRear: { $regex: String(keyword), $options: "i" } },
            { cameraFront: { $regex: String(keyword), $options: "i" } },
            { operatingSystem: { $regex: String(keyword), $options: "i" } },
            { colors: { $elemMatch: { name: { $regex: String(keyword), $options: "i" } } } },
            { variants: { $elemMatch: { name: { $regex: String(keyword), $options: "i" } } } },
          ],
        },
        { status: true },
      ],
    })
    .populate("brand_id")
    .populate("category_id");
};

/**
 * Tìm kiếm theo mức giá
 */
exports.searchByPriceRange = async (minPrice, maxPrice) => {
  const query = { status: true };

  if (minPrice !== undefined && maxPrice !== undefined) {
    query.price = { $gte: minPrice, $lte: maxPrice };
  } else if (minPrice !== undefined) {
    query.price = { $gte: minPrice };
  } else if (maxPrice !== undefined) {
    query.price = { $lte: maxPrice };
  }

  return await productModel
    .find(query)
    .populate("brand_id")
    .populate("category_id");
};