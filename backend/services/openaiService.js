const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
require('dotenv').config();
const { systemPrompts, modelMap } = require('../config/modelMap');
const chatService = require('./chatService');
const searchService = require('./searchService');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

exports.processMessage = async (userId, model, message, useSearch) => {
  const history = global.conversationHistories[userId] || [];
  let modifiedMessage = message;

  if (!global.conversationHistories[userId]) global.conversationHistories[userId] = [];

  if (useSearch) {
    const searchContext = await searchService.processSearchQuery(message);
    modifiedMessage = `${searchContext}\n\nDựa vào thông tin trên, hãy trả lời câu hỏi.`;
  }

  history.push({ role: "user", content: modifiedMessage });
  await chatService.saveMessage(userId, 'user', modifiedMessage);

  const systemPrompt = systemPrompts[model] || systemPrompts["default"];
  let reply = "Xin lỗi, không thể xử lý model này.";

  try {
    if (model.startsWith("GPT")) {
      const messages = [{ role: "system", content: systemPrompt }, ...history];
      const completion = await openai.chat.completions.create({
        model: modelMap[model],
        messages,
      });
      reply = completion.choices[0]?.message?.content || reply;
    } else if (model.startsWith("Gemini")) {
      const geminiModel = genAI.getGenerativeModel({ model: modelMap[model], systemInstruction: systemPrompt });
      const geminiHistory = history.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
      const chat = geminiModel.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(modifiedMessage);
      reply = result.response.text();
    } else if (model.startsWith("Claude")) {
      const claudeMessages = history.map(msg => ({ role: msg.role, content: msg.content }));
      const result = await anthropic.messages.create({
        model: modelMap[model],
        system: systemPrompt,
        messages: claudeMessages,
        max_tokens: 2048,
      });
      reply = result.content[0]?.text || reply;
    } else if (model.startsWith("DeepSeek")) {
      const deepseekMessages = [{ role: "system", content: systemPrompt }, ...history];
      const response = await axios.post("https://api.deepseek.com/chat/completions", {
        model: modelMap[model],
        messages: deepseekMessages
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      reply = response.data.choices[0]?.message?.content || reply;
    }
  } catch (err) {
    console.error("Lỗi trong quá trình gọi AI model:", err.message);
    reply = "Đã xảy ra lỗi khi xử lý yêu cầu AI.";
  }

  global.conversationHistories[userId].push({ role: "assistant", content: reply });
  await chatService.saveMessage(userId, 'assistant', reply);
  return reply;
};
