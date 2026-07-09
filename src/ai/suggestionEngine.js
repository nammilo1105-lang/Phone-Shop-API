const productModel = require("../apps/models/products");
const { detectBrand } = require("./brandMapper");
const { fuzzySearch } = require("./smartSearch");
const {
  recommendSimilar,
  recommendAccessory,
  recommendByBrand,
  recommendByCategory,
  recommendBestSellers,
} = require("./recommend");

exports.suggestProducts = async (keyword, options = {}) => {
  if (!keyword) {
    return {
      found: false,
      products: [],
      message: "Vui lòng nhập từ khóa tìm kiếm.",
    };
  }

  const limit = options.limit || 5;

  const exactProducts = await productModel
    .find({
      name: { $regex: keyword, $options: "i" },
      status: true,
    })
    .populate("brand_id")
    .populate("category_id")
    .limit(limit);

  if (exactProducts.length > 0) {
    return {
      found: true,
      products: exactProducts,
      message: `Tìm thấy ${exactProducts.length} sản phẩm phù hợp.`,
    };
  }

  const fuzzyProducts = await fuzzySearch(keyword, limit);
  if (fuzzyProducts.length > 0) {
    return {
      found: true,
      products: fuzzyProducts,
      message: `Không tìm thấy chính xác. Đây là ${fuzzyProducts.length} sản phẩm tương tự:`,
    };
  }

  const brand = detectBrand(keyword);
  if (brand) {
    const brandProducts = await productModel
      .find({
        "brand_id.name": brand,
        status: true,
      })
      .populate("brand_id")
      .populate("category_id")
      .limit(limit);

    if (brandProducts.length > 0) {
      return {
        found: true,
        products: brandProducts,
        message: `Không tìm thấy "${keyword}". Đây là các sản phẩm ${brand}:`,
      };
    }
  }

  const bestSellers = await recommendBestSellers(limit);
  if (bestSellers.length > 0) {
    return {
      found: false,
      products: bestSellers,
      message: `Không tìm thấy "${keyword}". Bạn có thể tham khảo các sản phẩm bán chạy:`,
    };
  }

  return {
    found: false,
    products: [],
    message: `Không tìm thấy "${keyword}" và không có gợi ý phù hợp.`,
  };
};

exports.suggestSimilar = async (product, limit = 5) => {
  if (!product) return [];

  return await recommendSimilar(product, limit);
};

exports.suggestAccessories = async (product, limit = 5) => {
  if (!product) return [];

  return await recommendAccessory(product, limit);
};

exports.suggestQuestions = (currentMessage, products = []) => {
  const suggestions = [];

  if (products.length > 0) {
    const product = products[0];
    suggestions.push(`Giá ${product.name} là bao nhiêu?`);
    suggestions.push(`${product.name} còn hàng không?`);
    suggestions.push(`So sánh ${product.name} với sản phẩm khác`);
    suggestions.push(`Phụ kiện cho ${product.name}`);
  }

  suggestions.push("Điện thoại nào tốt dưới 10 triệu?");
  suggestions.push("Điện thoại pin trâu");
  suggestions.push("Điện thoại chụp ảnh đẹp");
  suggestions.push("Điện thoại chơi game");
  suggestions.push("iPhone mới nhất");

  return suggestions.slice(0, 5);
};

exports.contextualSuggestion = async (keyword, lastProducts = []) => {
  if (!keyword) {
    return {
      found: false,
      products: [],
      message: "Vui lòng nhập từ khóa tìm kiếm.",
    };
  }

  if (lastProducts.length > 0 && keyword.split(/\s+/).length <= 2) {
    const lastProduct = lastProducts[0];

    const similarProducts = await recommendSimilar(lastProduct, 5);
    if (similarProducts.length > 0) {
      return {
        found: true,
        products: similarProducts,
        message: `Dựa trên ${lastProduct.name}, đây là các sản phẩm tương tự:`,
      };
    }

    if (lastProduct.brand_id) {
      const brandProducts = await recommendByBrand(lastProduct.brand_id._id, 5);
      if (brandProducts.length > 0) {
        return {
          found: true,
          products: brandProducts,
          message: `Dựa trên ${lastProduct.name}, đây là các sản phẩm cùng hãng:`,
        };
      }
    }

    if (lastProduct.category_id) {
      const categoryProducts = await recommendByCategory(
        lastProduct.category_id._id,
        5
      );
      if (categoryProducts.length > 0) {
        return {
          found: true,
          products: categoryProducts,
          message: `Dựa trên ${lastProduct.name}, đây là các sản phẩm cùng danh mục:`,
        };
      }
    }
  }

  return exports.suggestProducts(keyword);
};
