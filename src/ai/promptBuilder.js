const { formatProductMarkdown } = require("./formatter");

/**
 * Build prompt cho Gemini AI (ưu tiên MongoDB)
 * @param {string} message - Tin nhắn của user
 * @param {string} intent - Intent được detect
 * @param {Array} products - Danh sách sản phẩm từ MongoDB
 * @param {Object} memory - Memory của user (lịch sử chat)
 * @returns {string} - Prompt hoàn chỉnh
 */
exports.buildPrompt = (message, intent, products = [], memory = null) => {
  // Format sản phẩm (giới hạn 5 sản phẩm để prompt ngắn)
  let productInfo = "";
  let hasProducts = false;

  if (products && products.length > 0) {
    hasProducts = true;
    const limitedProducts = products.slice(0, 5);
    productInfo = limitedProducts
      .map((product) => formatProductMarkdown(product))
      .join("\n\n---\n\n");
  } else {
    productInfo = "KHÔNG CÓ DỮ LIỆU SẢN PHẨM TỪ DATABASE.";
  }

  // Format memory (chỉ 3 câu gần nhất)
  let memoryInfo = "";
  if (memory && memory.history && memory.history.length > 0) {
    memoryInfo = memory.history
      .slice(-3)
      .map((item) => `User: ${item.userMessage}\nAI: ${item.aiResponse}`)
      .join("\n\n");
  }

  // Prompt với quy tắc rõ ràng
  const prompt = `Bạn là AI Phone Shop. Bán: điện thoại, iPad, tablet, đồng hồ, tai nghe, sạc, cáp, phụ kiện.

---
LỊCH SỬ HỘI THOẠI (3 câu gần nhất)
---
${memoryInfo || "Chưa có lịch sử."}

---
DỮ LIỆU SẢN PHẨM TỪ DATABASE
---
${productInfo}

---
QUY TẮC QUAN TRỌNG - BẮT BUỘC TUÂN THỦ
---

1. ${hasProducts ? "✅ CÓ DỮ LIỆU SẢN PHẨM - PHẢI SỬ DỤNG DỮ LIỆU TRÊN" : "❌ KHÔNG CÓ DỮ LIỆU - CHỈ ĐƯỢC TRẢ LỜI DỰA TRÊN KIẾN THỨC CHUNG"}

2. ${hasProducts ? "✅ Nếu có sản phẩm trong DỮ LIỆU SẢN PHẨM, bạn PHẢI giới thiệu sản phẩm đó. KHÔNG ĐƯỢC nói 'không có sản phẩm'." : "❌ Nếu không có dữ liệu, bạn được phép nói 'Website chưa có sản phẩm này' hoặc gợi ý sản phẩm tương tự."}

3. ${hasProducts ? "✅ GIÁ, CẤU HÌNH, KHUYẾN MÃI, MÀU SẮC, PHIÊN BẢN - PHẢI LẤY TỪ DỮ LIỆU TRÊN. KHÔNG ĐƯỢC BỊA." : "❌ Không được bịa thông tin sản phẩm."}

4. Trả lời ngắn gọn, dễ hiểu, dùng markdown (bold, list, table).

5. Nếu có nhiều sản phẩm, liệt kê chúng dưới dạng list hoặc table.

---
CÂU HỎI CỦA KHÁCH
---
Intent: ${intent}
Message: ${message}

---
HÃY TRẢ LỜI THEO QUY TẮC TRÊN
---`;

  return prompt;
};
