const ai = require("../../../../config/gemini");

const { detectIntent } = require("../../../ai/intentDetector");

const { extractKeyword } = require("../../../ai/keywordExtractor");

const { executeIntent } = require("../../../ai/aiAgent");

const { buildPrompt } = require("../../../ai/promptBuilder");

const {
  addConversation,
  getMemory,
  getLastProducts,
} = require("../../../ai/memory");

const { suggestQuestions } = require("../../../ai/suggestionEngine");

/**

 * Chat with AI Controller

 * Chỉ nhận request, gọi các module AI, và trả response

 */

exports.chatWithAI = async (req, res) => {
  try {
    const { message, userId } = req.body;

    // Sử dụng userId từ request hoặc tạo session ID

    const sessionId = userId || req.sessionID || req.ip || "anonymous";

    // Detect intent và extract keyword

    const intent = detectIntent(message);

    const keyword = extractKeyword(message);

    console.log("Intent:", intent);
    console.log("Keyword:", keyword);

    // Lấy memory của user

    const memory = getMemory(sessionId);
    const lastProducts = getLastProducts(sessionId);

    // Nếu keyword rỗng và có sản phẩm gần nhất, sử dụng sản phẩm đó

    let searchKeyword = keyword;

    if (
      !keyword &&
      lastProducts &&
      lastProducts.length > 0
    ) {
      searchKeyword = lastProducts[0].name;
    }

    // Execute intent với smart search và lastProducts
    const result = await executeIntent(intent, searchKeyword, {
      useSmartSearch: true,
      lastProducts: lastProducts,
    });

    const { products, suggestions, message: suggestionMessage } = result;

    console.log("Products from executeIntent:", products?.length || 0);

    // Xử lý kết quả so sánh (trả về object thay vì array)

    let productsArray = products;

    if (products && products.p1 && products.p2) {
      productsArray = [products.p1, products.p2].filter(Boolean);
    } else if (!Array.isArray(products)) {
      productsArray = [];
    }

    // Build prompt với memory và products

    const prompt = buildPrompt(message, intent, productsArray, memory);

    // Thêm thông tin gợi ý vào prompt nếu có
    let enhancedPrompt = prompt;
    if (suggestionMessage && suggestionMessage.length > 0) {
      enhancedPrompt += `\n\nGỢI Ý:\n${suggestionMessage}`;
    }

    console.log("Prompt length:", enhancedPrompt.length);

    // Gọi Gemini AI

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: enhancedPrompt,
    });

    const aiReply = response.text;

    // Lưu conversation vào memory

    addConversation(sessionId, message, aiReply, productsArray);

    // Gợi ý câu hỏi tiếp theo
    const questionSuggestions = suggestQuestions(message, productsArray);

    res.json({
      success: true,

      reply: aiReply,

      products: productsArray,
      suggestions: suggestions,
      questionSuggestions: questionSuggestions,
    });
  } catch (err) {
    console.error("Chat AI Error:", err);

    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};
