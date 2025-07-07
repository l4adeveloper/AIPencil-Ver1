const { pool } = require('../config/db');
const { processSearchQuery } = require('./searchService');

exports.saveMessage = async (userId, role, message) => {
  try {
    await pool.query(
      'INSERT INTO chat_history (user_tag, role, message) VALUES ($1,$2,$3)',
      [userId, role, message]
    );
  } catch (err) {
    console.error('Lỗi saveMessage:', err.message);
  }
};

exports.getHistory = async (userId) => {
  const result = await pool.query(
    'SELECT role, message, created_at FROM chat_history WHERE user_tag=$1 ORDER BY id',
    [userId]
  );
  return result.rows;
};

exports.processMessage = async (message, searchEnabled) => {
  try {
    if (searchEnabled) {
      // Process the message with search functionality
      const searchContext = await processSearchQuery(message);
      return searchContext;
    }
    return message;
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
};
