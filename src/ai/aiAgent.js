const {
  searchByName,

  searchStock,

  searchByPrice,

  searchPromotion,

  compareProducts,

  searchByBrand,

  searchByCategory,

  searchAccessory,

  searchByRAM,

  searchByROM,

  searchByCPU,

  searchByBattery,

  searchByCamera,

  searchByScreen,

  searchByColor,

  searchByVariant,

  searchByPriceRange,
} = require("./productFunctions");

const { extractMaxPrice } = require("./priceParser");

const { extractCompareProducts } = require("./compareParser");

const { searchWithSuggestions } = require("./smartSearch");

const { suggestProducts } = require("./suggestionEngine");

/**

 * Execute intent và trả về kết quả từ MongoDB

 * @param {string} intent - Intent được detect

 * @param {string} keyword - Keyword từ tin nhắn

 * @param {Object} options - Các tùy chọn bổ sung (useSmartSearch, lastProducts)

 * @returns {Object} - { products: [], suggestions: [], message: string }

 */

exports.executeIntent = async (intent, keyword, options = {}) => {
  console.log("Intent:", intent);

  console.log("Keyword:", keyword);

  const useSmartSearch = options.useSmartSearch !== false; // Mặc định true

  // const lastProducts = options.lastProducts || [];

  let products = [];

  let suggestions = [];

  let message = "";
  switch (intent) {
    case "PRICE":
      products = await searchByPrice(keyword);
      break;
    case "PRICE_RANGE":
      const maxPrice = extractMaxPrice(keyword);
      if (maxPrice) {
        products = await searchByPriceRange(0, maxPrice);
      } else {
        products = await searchByPrice(keyword);
      }

      break;

    case "STOCK":
      products = await searchStock(keyword);

      break;

    case "PROMOTION":
      products = await searchPromotion();

      break;

    case "BRAND":
      products = await searchByBrand(keyword);

      break;

    case "CATEGORY":
      products = await searchByCategory(keyword);

      break;

    case "ACCESSORY":
      products = await searchAccessory(keyword);

      break;

    case "COLOR":
      products = await searchByColor(keyword);

      break;

    case "VARIANT":
      products = await searchByVariant(keyword);

      break;

    case "RAM":
      products = await searchByRAM(keyword);

      break;

    case "ROM":
      products = await searchByROM(keyword);

      break;

    case "CPU":
      products = await searchByCPU(keyword);

      break;

    case "BATTERY":
      products = await searchByBattery(keyword);

      break;

    case "CAMERA":
      products = await searchByCamera(keyword);

      break;

    case "SCREEN":
      products = await searchByScreen(keyword);

      break;

    case "COMPARE":
      const compareResult = extractCompareProducts(keyword);

      if (compareResult) {
        const comparison = await compareProducts(
          compareResult.product1,

          compareResult.product2,
        );

        products = [comparison.p1, comparison.p2].filter(Boolean);
      } else {
        // Fallback: so sánh bằng keyword

        const fallbackComparison = await compareProducts(keyword, "");

        products = [fallbackComparison.p1, fallbackComparison.p2].filter(
          Boolean,
        );
      }

      break;

    case "PRODUCT":

    default:
      // Sử dụng smart search cho intent PRODUCT

      if (useSmartSearch) {
        const searchResult = await searchWithSuggestions(keyword);

        products = searchResult.products;

        suggestions = searchResult.suggestions;
      } else {
        products = await searchByName(keyword);
      }

      break;
  }

  // Nếu không tìm thấy sản phẩm, sử dụng suggestion engine

  if (!products || products.length === 0) {
    const suggestionResult = await suggestProducts(keyword);

    products = suggestionResult.products;

    message = suggestionResult.message;
  }

  return {
    products,

    suggestions,

    message,
  };
};
