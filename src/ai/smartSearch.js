const productModel = require("../apps/models/products");
const { detectBrand } = require("./brandMapper");
const { parseFilters, buildQueryFromFilters } = require("./filterParser");
const brandModel = require("../apps/models/brands"); // chỉnh đúng path model Brand của bạn

exports.smartSearch = async (keyword, options = {}) => {
  if (!keyword) return [];

  const text = keyword.toLowerCase().trim();
  const limit = options.limit || 10;

  const brand = detectBrand(text);
  const filters = parseFilters(text);

  const query = await buildSmartQuery(text, brand, filters);

  const products = await productModel
    .find(query)
    .populate("brand_id")
    .populate("category_id")
    .limit(limit);

  return products;
};

async function buildSmartQuery(text, brand, filters) {
  const query = { status: true };

  const commonKeywords = ["điện thoại", "phone", "mobile", "iphone", "samsung", "oppo", "vivo", "xiaomi", "realme", "oneplus", "huawei", "nokia", "sony", "htc", "lg", "motorola", "google", "asus", "lenovo", "microsoft", "blackberry", "máy", "dế yêu", "dtdd"];
  const isCommonKeyword = commonKeywords.some(kw => text.includes(kw));

  let brandId = null;
  if (brand) {
    const brandDoc = await brandModel.findOne({ name: { $regex: brand, $options: "i" } });
    brandId = brandDoc?._id || null;
  }

  if (isCommonKeyword && text.split(/\s+/).length <= 2) {
    if (brandId) {
      query.brand_id = brandId;
    }
  } else {
    if (filters && Object.keys(filters).length > 0) {
      const filterQuery = buildQueryFromFilters(filters);
      Object.assign(query, filterQuery);
    }

    const nameRegex = new RegExp(text.replace(/\s+/g, ".*"), "i");

    const searchConditions = [
      { name: { $regex: nameRegex } },
      { description: { $regex: nameRegex } },
      { cpu: { $regex: nameRegex } },
      { operatingSystem: { $regex: nameRegex } },
    ];

    if (brandId) {
      searchConditions.push({ brand_id: brandId });
    }

    if (Object.keys(query).length === 1) {
      query.$or = searchConditions;
    } else {
      query.$and = [
        ...searchConditions.map((cond) => ({ $or: [cond] })),
      ];
    }
  }

  return query;
}

exports.fuzzySearch = async (keyword, limit = 5) => {
  if (!keyword) return [];

  const text = keyword.toLowerCase().trim();
  const cleanedText = text.replace(/[^a-z0-9\s]/g, "").trim();
  const words = cleanedText.split(/\s+/).filter((w) => w.length > 2);

  if (words.length === 0) return [];

  const regexPatterns = words.map((word) => new RegExp(word, "i"));

  // Tìm brand_id tương ứng qua tên brand (thay vì regex trực tiếp vào brand_id)
  const matchedBrands = await brandModel.find({
    name: { $in: regexPatterns },
  }).select("_id");
  const brandIds = matchedBrands.map((b) => b._id);

  const orConditions = [
    { name: { $in: regexPatterns } },
    { description: { $in: regexPatterns } },
    { cpu: { $in: regexPatterns } },
  ];

  if (brandIds.length > 0) {
    orConditions.push({ brand_id: { $in: brandIds } });
  }

  const query = {
    status: true,
    $or: orConditions,
  };

  const products = await productModel
    .find(query)
    .populate("brand_id")
    .populate("category_id")
    .limit(limit);

  return products;
};

exports.contextualSearch = async (keyword, lastProducts = []) => {
  if (!keyword) return [];

  if (lastProducts.length > 0 && keyword.split(/\s+/).length <= 2) {
    const lastProduct = lastProducts[0];
    const contextQuery = {
      status: true,
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { brand_id: lastProduct.brand_id?._id },
        { category_id: lastProduct.category_id?._id },
      ],
    };

    const products = await productModel
      .find(contextQuery)
      .populate("brand_id")
      .populate("category_id")
      .limit(5);

    if (products.length > 0) {
      return products;
    }
  }

  return exports.smartSearch(keyword);
};

exports.searchWithSuggestions = async (keyword) => {
  const products = await exports.smartSearch(keyword);

  let suggestions = [];

  if (products.length === 0) {
    const similarProducts = await exports.fuzzySearch(keyword);
    suggestions = similarProducts;
  }

  return {
    products,
    suggestions,
  };
};
