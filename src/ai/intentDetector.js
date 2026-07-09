const { isCompareIntent } = require("./compareParser");

/**
 * Detect intent từ tin nhắn của user
 * @param {string} message - Tin nhắn của user
 * @returns {string} - Intent detected
 */
exports.detectIntent = (message) => {
  if (!message) return "PRODUCT";

  const text = message.toLowerCase().trim();

  // 1. So sánh sản phẩm (ưu tiên cao nhất)
  if (isCompareIntent(text)) return "COMPARE";

  // 2. Hỏi về giá
  const priceKeywords = [
    "giá",
    "bao nhiêu",
    "多少钱",
    "thành tiền",
    "giá bán",
    "giá niêm yết",
    "giá thị trường",
    "mấy tiền",
    "bao nhiêu tiền",
  ];
  if (priceKeywords.some((keyword) => text.includes(keyword))) return "PRICE";

  // 3. Hỏi về mức giá (dưới/từ/triệu)
  const priceRangeKeywords = [
    "dưới",
    "từ",
    "triệu",
    "trên",
    "nhỏ hơn",
    "lớn hơn",
    "giá rẻ",
    "giá thấp",
    "giá cao",
    "trong khoảng",
  ];
  if (priceRangeKeywords.some((keyword) => text.includes(keyword))) return "PRICE_RANGE";

  // 4. Hỏi về tồn kho
  const stockKeywords = [
    "còn hàng",
    "tồn kho",
    "có sẵn",
    "hết hàng",
    "còn không",
    "số lượng",
    "kho",
  ];
  if (stockKeywords.some((keyword) => text.includes(keyword))) return "STOCK";

  // 5. Hỏi về khuyến mãi
  const promotionKeywords = [
    "khuyến mãi",
    "ưu đãi",
    "giảm giá",
    "promotion",
    "sale",
    "discount",
    "thanh lý",
    "trả góp",
    "quà tặng",
  ];
  if (promotionKeywords.some((keyword) => text.includes(keyword))) return "PROMOTION";

  // 6. Hỏi về màu sắc
  const colorKeywords = [
    "màu",
    "color",
    "màu sắc",
    "đen",
    "trắng",
    "đỏ",
    "xanh",
    "vàng",
    "hồng",
    "tím",
    "cam",
    "xám",
    "bạc",
  ];
  if (colorKeywords.some((keyword) => text.includes(keyword))) return "COLOR";

  // 7. Hỏi về phiên bản
  const variantKeywords = [
    "phiên bản",
    "variant",
    "bản",
    "pro",
    "max",
    "plus",
    "ultra",
    "lite",
    "mini",
  ];
  if (variantKeywords.some((keyword) => text.includes(keyword))) return "VARIANT";

  // 8. Hỏi về RAM
  const ramKeywords = [
    "ram",
    "bộ nhớ",
    "gb ram",
    "g ram",
  ];
  if (ramKeywords.some((keyword) => text.includes(keyword))) return "RAM";

  // 9. Hỏi về ROM
  const romKeywords = [
    "rom",
    "bộ nhớ trong",
    "dung lượng lưu trữ",
    "gb bộ nhớ",
    "gb rom",
    "tb",
  ];
  if (romKeywords.some((keyword) => text.includes(keyword))) return "ROM";

  // 10. Hỏi về CPU
  const cpuKeywords = [
    "cpu",
    "chip",
    "vi xử lý",
    "processor",
    "snapdragon",
    "mediatek",
    "helio",
    "dimensity",
    "a-series",
    "bionic",
  ];
  if (cpuKeywords.some((keyword) => text.includes(keyword))) return "CPU";

  // 11. Hỏi về pin
  const batteryKeywords = [
    "pin",
    "battery",
    "dung lượng pin",
    "mah",
    "sạc nhanh",
    "sạc không dây",
    "pin trâu",
    "pin lâu",
  ];
  if (batteryKeywords.some((keyword) => text.includes(keyword))) return "BATTERY";

  // 12. Hỏi về camera
  const cameraKeywords = [
    "camera",
    "máy ảnh",
    "chụp ảnh",
    "mp",
    "megapixel",
    "camera sau",
    "camera trước",
    "camera selfie",
    "quay phim",
    "4k",
  ];
  if (cameraKeywords.some((keyword) => text.includes(keyword))) return "CAMERA";

  // 13. Hỏi về màn hình
  const screenKeywords = [
    "màn hình",
    "screen",
    "display",
    "hiển thị",
    "inch",
    "amoled",
    "oled",
    "lcd",
    "ips",
    "tft",
    "độ phân giải",
    "hz",
    "tần số quét",
  ];
  if (screenKeywords.some((keyword) => text.includes(keyword))) return "SCREEN";

  // 14. Hỏi về hãng
  const brandKeywords = [
    "hãng",
    "brand",
    "thương hiệu",
    "nhà sản xuất",
  ];
  if (brandKeywords.some((keyword) => text.includes(keyword))) return "BRAND";

  // 15. Hỏi về danh mục
  const categoryKeywords = [
    "danh mục",
    "category",
    "loại",
    "dòng",
    "series",
  ];
  if (categoryKeywords.some((keyword) => text.includes(keyword))) return "CATEGORY";

  // 16. Hỏi về phụ kiện
  const accessoryKeywords = [
    "phụ kiện",
    "ốp",
    "tai nghe",
    "sạc",
    "cáp",
    "case",
    "bao da",
    "kính cường lực",
    "sạc dự phòng",
    "power bank",
  ];
  if (accessoryKeywords.some((keyword) => text.includes(keyword))) return "ACCESSORY";

  // 17. Nhu cầu sử dụng (semantic intents)
  const useCaseKeywords = {
    gaming: ["chơi game", "gaming", "game", "đồ họa"],
    camera: ["chụp ảnh", "nhiếp ảnh", "camera tốt", "máy ảnh đẹp"],
    battery: ["pin trâu", "pin lâu", "pin tốt", "sạc lâu"],
    budget: ["giá rẻ", "thấp", "sinh viên", "học sinh", "giá tốt"],
    business: ["văn phòng", "công việc", "doanh nhân", "hợp tác"],
    compact: ["mỏng nhẹ", "nhỏ gọn", "thon gọn", "dễ mang"],
  };

  for (const [intent, keywords] of Object.entries(useCaseKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return intent.toUpperCase();
    }
  }

  // 18. Câu hỏi chung (tư vấn, gợi ý)
  const generalKeywords = [
    "gợi ý",
    "tư vấn",
    "nên mua",
    "điện thoại nào",
    "máy nào",
    "chọn",
    "khuyên",
    "đánh giá",
    "review",
    "tốt",
    "tốt nhất",
  ];
  if (generalKeywords.some((keyword) => text.includes(keyword))) return "RECOMMEND";

  // Mặc định: tìm kiếm sản phẩm
  return "PRODUCT";
};