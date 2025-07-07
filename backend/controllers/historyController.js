const chatService = require('../services/chatService');

exports.getHistory = async (req, res) => {
  const userId = req.params.userId;
  try {
    const history = await chatService.getHistory(userId);
    res.json(history);
  } catch (err) {
    console.error('Lỗi getHistory:', err.message);
    res.status(500).json({ error: 'Không thể lấy lịch sử' });
  }
};
