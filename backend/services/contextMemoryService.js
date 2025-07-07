const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class ContextMemory {
  constructor(maxContextLength = 10) {
    this.maxContextLength = maxContextLength;
    this.contexts = [];
  }

  // Thêm context mới
  addContext(question, answer) {
    this.contexts.push({
      question,
      answer,
      timestamp: Date.now()
    });

    // Giới hạn số lượng context
    if (this.contexts.length > this.maxContextLength) {
      this.contexts.shift();
    }
  }

  // Xóa toàn bộ context
  clearContext() {
    this.contexts = [];
  }

  // Kiểm tra xem câu hỏi mới có liên quan đến context cũ không
  async isRelatedToContext(newQuestion) {
    if (this.contexts.length === 0) return false;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // Tạo prompt để kiểm tra mối liên hệ
    const contextSummary = this.contexts
      .map(ctx => `Q: ${ctx.question}\nA: ${ctx.answer}`)
      .join('\n\n');

    const prompt = `Kiểm tra xem câu hỏi mới có liên quan đến các câu hỏi và câu trả lời trước đó không.
Chỉ trả về "true" nếu có liên quan, "false" nếu không liên quan.

Context trước đó:
${contextSummary}

Câu hỏi mới: ${newQuestion}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().toLowerCase() === 'true';
    } catch (error) {
      console.error('Lỗi kiểm tra mối liên hệ:', error);
      return false;
    }
  }

  // Lấy context liên quan
  async getRelevantContext(newQuestion) {
    if (!await this.isRelatedToContext(newQuestion)) {
      return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // Tạo prompt để tìm context liên quan
    const contextSummary = this.contexts
      .map(ctx => `Q: ${ctx.question}\nA: ${ctx.answer}`)
      .join('\n\n');

    const prompt = `Dựa trên câu hỏi mới và context trước đó, hãy tìm và tổng hợp thông tin liên quan.
Chỉ trả về thông tin thực sự liên quan đến câu hỏi mới.

Context trước đó:
${contextSummary}

Câu hỏi mới: ${newQuestion}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Lỗi lấy context liên quan:', error);
      return null;
    }
  }
}

// Tạo instance mặc định
const contextMemory = new ContextMemory();

module.exports = {
  contextMemory,
  ContextMemory
}; 