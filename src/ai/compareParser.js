/**
 * Compare Parser - Tự động tách 2 sản phẩm để so sánh
 * Hỗ trợ nhiều cách viết: "với", "vs", "và", ",", "so sánh", v.v.
 */

/**
 * Tách 2 sản phẩm từ tin nhắn so sánh
 * @param {string} message - Tin nhắn của user
 * @returns {Object|null} - Object {product1, product2} hoặc null
 */
exports.extractCompareProducts = (message) => {
  if (!message) return null;

  const text = message.toLowerCase();

  // Các từ khóa phân tách
  const separators = [
    /\s+và\s+/i,
    /\s+với\s+/i,
    /\s+vs\s+/i,
    /\s+versus\s+/i,
    /\s+so với\s+/i,
    /\s+,\s+/,
    /\s+compare\s+/i,
    /\s+so sánh\s+/i,
  ];

  let product1 = null;
  let product2 = null;

  // Tìm separator
  for (const separator of separators) {
    const parts = message.split(separator);
    if (parts.length === 2) {
      product1 = parts[0].trim();
      product2 = parts[1].trim();
      break;
    }
  }

  // Nếu không tìm thấy separator, thử tách theo từ khóa "so sánh"
  if (!product1 && !product2) {
    const compareIndex = text.indexOf("so sánh");
    if (compareIndex !== -1) {
      const afterCompare = message.substring(compareIndex + 8).trim();
      const parts = afterCompare.split(/[và,]/i);
      if (parts.length >= 2) {
        product1 = parts[0].trim();
        product2 = parts[1].trim();
      }
    }
  }

  // Nếu vẫn không tìm thấy, thử tách theo từ khóa đầu tiên
  if (!product1 && !product2) {
    const words = message.split(/\s+/);
    if (words.length >= 4) {
      // Giả định 2 từ đầu là sản phẩm 1, 2 từ tiếp theo là sản phẩm 2
      product1 = words.slice(0, 2).join(" ");
      product2 = words.slice(2, 4).join(" ");
    }
  }

  if (product1 && product2) {
    // Xóa các từ không cần thiết
    const removeWords = ["so sánh", "compare", "giữa", "với", "và", "vs", "versus"];
    product1 = cleanProductName(product1, removeWords);
    product2 = cleanProductName(product2, removeWords);

    return { product1, product2 };
  }

  return null;
};

/**
 * Làm sạch tên sản phẩm
 * @param {string} name - Tên sản phẩm
 * @param {Array} removeWords - Danh sách từ cần xóa
 * @returns {string} - Tên sản phẩm đã làm sạch
 */
function cleanProductName(name, removeWords) {
  let cleaned = name.trim();
  for (const word of removeWords) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleaned = cleaned.replace(regex, "").trim();
  }
  return cleaned;
}

/**
 * Phát hiện intent so sánh
 * @param {string} message - Tin nhắn của user
 * @returns {boolean} - True nếu là intent so sánh
 */
exports.isCompareIntent = (message) => {
  if (!message) return false;

  const text = message.toLowerCase();
  const compareKeywords = [
    "so sánh",
    "compare",
    "vs",
    "versus",
    "với",
    "giữa",
  ];

  for (const keyword of compareKeywords) {
    if (text.includes(keyword)) {
      return true;
    }
  }

  return false;
};