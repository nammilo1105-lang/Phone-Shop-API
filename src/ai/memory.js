const memory = new Map();

/**
 * Lưu bộ nhớ cho user
 * @param {string} userId - ID của user (có thể là session ID hoặc user ID)
 * @param {Object} data - Dữ liệu cần lưu
 */
exports.saveMemory = (userId, data) => {
  const old = memory.get(userId) || {};

  memory.set(userId, {
    ...old,
    ...data,
    updatedAt: Date.now(),
  });
};

/**
 * Đọc bộ nhớ của user
 * @param {string} userId - ID của user
 * @returns {Object} - Memory object
 */
exports.getMemory = (userId) => {
  return memory.get(userId);
};

/**
 * Xóa bộ nhớ của user
 * @param {string} userId - ID của user
 */
exports.clearMemory = (userId) => {
  memory.delete(userId);
};

/**
 * Thêm một cuộc hội thoại vào lịch sử
 * @param {string} userId - ID của user
 * @param {string} userMessage - Tin nhắn của user
 * @param {string} aiResponse - Trả lời của AI
 * @param {Array} products - Danh sách sản phẩm được tìm thấy (optional)
 */
exports.addConversation = (userId, userMessage, aiResponse, products = []) => {
  const currentMemory = memory.get(userId) || {
    history: [],
    lastProducts: [],
    updatedAt: Date.now(),
  };

  // Thêm cuộc hội thoại mới
  currentMemory.history.push({
    userMessage,
    aiResponse,
    timestamp: Date.now(),
    products: products.length > 0 ? products : undefined,
  });

  // Giới hạn lịch sử tối đa 5 câu gần nhất
  if (currentMemory.history.length > 5) {
    currentMemory.history = currentMemory.history.slice(-5);
  }

  // Lưu sản phẩm gần nhất để context cho câu hỏi tiếp theo
  if (products && products.length > 0) {
    currentMemory.lastProducts = products;
  }

  currentMemory.updatedAt = Date.now();

  memory.set(userId, currentMemory);
};

/**
 * Lấy lịch sử hội thoại của user
 * @param {string} userId - ID của user
 * @returns {Array} - Danh sách lịch sử hội thoại
 */
exports.getHistory = (userId) => {
  const mem = memory.get(userId);
  return mem ? mem.history : [];
};

/**
 * Lấy sản phẩm gần nhất được user hỏi
 * @param {string} userId - ID của user
 * @returns {Array} - Danh sách sản phẩm gần nhất
 */
exports.getLastProducts = (userId) => {
  const mem = memory.get(userId);
  return mem ? mem.lastProducts : [];
};

/**
 * Xóa lịch sử hội thoại nhưng giữ lastProducts
 * @param {string} userId - ID của user
 */
exports.clearHistory = (userId) => {
  const mem = memory.get(userId);
  if (mem) {
    mem.history = [];
    mem.updatedAt = Date.now();
    memory.set(userId, mem);
  }
};