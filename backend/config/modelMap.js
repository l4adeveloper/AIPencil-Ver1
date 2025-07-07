exports.modelMap = {
  "GPT-4.1 mini": "gpt-4-turbo",
  "GPT o3": "gpt-3.5-turbo",
  "GPT 4o": "gpt-4o",
  "GPT 4o-mini": "gpt-4o-mini",
  "DeepSeek Chat": "deepseek-chat",
  "DeepSeek Reasoning": "deepseek-coder",
  "Claude Haiku 3": "claude-3-haiku-20240307",
  "Claude Sonnet 4": "claude-3-5-sonnet-20240620",
  "Claude Opus 3": "claude-3-opus-20240229",
  "Gemini 1.5": "gemini-1.5-flash-latest",
  "Gemini 2.0": "gemini-pro"
};

const friendlyPrompt = `Bạn là một trợ lý AI chuyên nghiệp, thân thiện, trả lời tự nhiên, dễ gần. Hãy tuân thủ các nguyên tắc sau:

- Sử dụng icon (emoji) phù hợp với nội dung
- Định dạng rõ ràng với heading, bullet, danh sách khi cần thiết
- Trình bày mạch lạc, dễ đọc, dễ hiểu
- Độ dài vừa đủ: không quá ngắn gọn, không lan man
- Ngôn từ thân thiện, tích cực, gần gũi, không máy móc
- Nếu có thể, hãy thêm cảm xúc tích cực vào câu trả lời
- Kết thúc bằng một câu chào hoặc lời động viên ngắn gọn 😊

Ví dụ:
# Tiêu đề chính
## Tiêu đề phụ
- Gạch đầu dòng
- Danh sách
- Sử dụng icon: ✅, 🚀, 💡, 📌, ...

Hãy đảm bảo mỗi câu trả lời đều chuyên nghiệp, hữu ích, tự nhiên và dễ tiếp cận.`;

exports.systemPrompts = {
  "GPT-4.1 mini": friendlyPrompt,
  "GPT o3": friendlyPrompt,
  "GPT 4o": friendlyPrompt,
  "GPT 4o-mini": friendlyPrompt,
  "DeepSeek Chat": friendlyPrompt,
  "DeepSeek Reasoning": friendlyPrompt,
  "Claude Haiku 3": friendlyPrompt,
  "Claude Sonnet 4": friendlyPrompt,
  "Claude Opus 3": friendlyPrompt,
  "Gemini 1.5": friendlyPrompt,
  "Gemini 2.0": friendlyPrompt,
  "default": friendlyPrompt
};

// Đề xuất thông số model tự nhiên
exports.modelParams = {
  temperature: 0.8,
  top_p: 0.95,
  frequency_penalty: 0.2,
  presence_penalty: 0.3,
  max_tokens: 512,
  response_format: 'markdown'
};
