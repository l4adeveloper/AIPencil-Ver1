const { pool } = require('../config/db');

exports.approveUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query("UPDATE users SET is_approved = true WHERE id = $1", [userId]);
    res.json({ success: true, message: "Người dùng đã được duyệt" });
  } catch (err) {
    console.error("Lỗi approveUser:", err.message);
    res.status(500).json({ success: false, message: "Không thể duyệt người dùng" });
  }
};
exports.getPendingUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, name, created_at FROM users WHERE is_approved = false");
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error("Lỗi getPendingUsers:", err.message);
    res.status(500).json({ success: false, message: "Không thể lấy danh sách" });
  }
};
