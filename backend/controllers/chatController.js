const { processMessage: processAIMessage } = require('../services/openaiService');
const { getOrCreateUserSession } = require('../services/sessionService');
const { formatReply } = require('../utils/formatReply');
const { processMessage: processSearchMessage } = require('../services/chatService');

exports.handleChat = async (req, res) => {
  const { model, message, userId, search } = req.body;
  if (!model || !message) return res.status(400).json({ error: 'Thiếu model hoặc message' });

  try {
    const sessionId = await getOrCreateUserSession(userId);
    
    // Process message with search if enabled
    let processedMessage = message;
    if (search) {
      processedMessage = await processSearchMessage(message, true);
    }
    
    // Get AI response
    const aiReply = await processAIMessage(sessionId, model, processedMessage, search);
    const htmlReply = formatReply(model, aiReply);
    res.json({ reply: htmlReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi xử lý AI', details: err.message });
  }
};
