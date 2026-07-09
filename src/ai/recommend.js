const productModel = require("../apps/models/products");

/**
 * Recommendation Engine
 * Gợi ý sản phẩm dựa trên các tiêu chí khác nhau
 */

/**
 * Gợi ý sản phẩm tương tự (cùng hãng, cùng danh mục, giá tương đương)
 * @param {Object} product - Sản phẩm gốc
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm gợi ý
 */
exports.recommendSimilar = async (product, limit = 5) => {
  if (!product) return [];

  try {
    const minPrice = product.price * 0.7; // 70% giá gốc
    const maxPrice = product.price * 1.3; // 130% giá gốc

    const similarProducts = await productModel
      .find({
        _id: { $ne: product._id }, // Loại trừ sản phẩm gốc
        $or: [
          { brand_id: product.brand_id }, // Cùng hãng
          { category_id: product.category_id }, // Cùng danh mục
        ],
        price: { $gte: minPrice, $lte: maxPrice }, // Giá tương đương
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    return similarProducts;
  } catch (error) {
    console.error("Error in recommendSimilar:", error);
    return [];
  }
};

/**
 * Gợi ý phụ kiện cho sản phẩm
 * @param {Object} product - Sản phẩm gốc
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách phụ kiện gợi ý
 */
exports.recommendAccessory = async (product, limit = 5) => {
  if (!product) return [];

  try {
    // Tìm danh mục phụ kiện
    const accessoryCategory = await productModel
      .findOne({ name: { $regex: "phụ kiện", $options: "i" } })
      .distinct("category_id");

    if (!accessoryCategory || accessoryCategory.length === 0) {
      return [];
    }

    const accessories = await productModel
      .find({
        category_id: { $in: accessoryCategory },
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    return accessories;
  } catch (error) {
    console.error("Error in recommendAccessory:", error);
    return [];
  }
};

/**
 * Gợi ý sản phẩm cùng hãng
 * @param {string} brandId - ID của hãng
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm cùng hãng
 */
exports.recommendByBrand = async (brandId, limit = 5) => {
  if (!brandId) return [];

  try {
    const products = await productModel
      .find({
        brand_id: brandId,
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error in recommendByBrand:", error);
    return [];
  }
};

/**
 * Gợi ý sản phẩm cùng danh mục
 * @param {string} categoryId - ID của danh mục
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm cùng danh mục
 */
exports.recommendByCategory = async (categoryId, limit = 5) => {
  if (!categoryId) return [];

  try {
    const products = await productModel
      .find({
        category_id: categoryId,
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error in recommendByCategory:", error);
    return [];
  }
};

/**
 * Gợi ý sản phẩm theo mức giá
 * @param {number} maxPrice - Giá tối đa
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm trong mức giá
 */
exports.recommendByPrice = async (maxPrice, limit = 5) => {
  if (!maxPrice) return [];

  try {
    const products = await productModel
      .find({
        price: { $lte: maxPrice },
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .sort({ price: -1 }) // Sắp xếp giảm dần theo giá
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error in recommendByPrice:", error);
    return [];
  }
};

/**
 * Gợi ý sản phẩm bán chạy
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm bán chạy
 */
exports.recommendBestSellers = async (limit = 5) => {
  try {
    const products = await productModel
      .find({
        status: true,
        soldCount: { $gt: 0 },
      })
      .populate("brand_id")
      .populate("category_id")
      .sort({ soldCount: -1 })
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error in recommendBestSellers:", error);
    return [];
  }
};

/**
 * Gợi ý sản phẩm có khuyến mãi
 * @param {number} limit - Số lượng sản phẩm gợi ý
 * @returns {Array} - Danh sách sản phẩm có khuyến mãi
 */
exports.recommendPromotions = async (limit = 5) => {
  try {
    const products = await productModel
      .find({
        status: true,
        promotion: { $ne: "", $exists: true },
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    return products;
  } catch (error) {
    console.error("Error in recommendPromotions:", error);
    return [];
  }
};
