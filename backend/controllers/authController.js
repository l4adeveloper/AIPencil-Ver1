const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ success: false, message: "Email không tồn tại" });
    }
    const userPassword = result.rows[0].password_hash
    const valid = await bcrypt.compare(password, userPassword);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Sai mật khẩu" });
    } 
    if (!user.is_approved) {
      return res.status(403).json({ success: false, message: "Tài khoản chưa được duyệt bởi quản lý." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, is_approved, role)
       VALUES ($1, $2, false, 'user')
       RETURNING id, email, is_approved`,
      [email, hashed]
    );

    res.status(201).json({
      success: true,
      message: "Tài khoản được tạo, đang chờ quản lý duyệt.",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
exports.logout = (req, res) => {
  // Xóa token phía client (thực hiện ở frontend)
  res.status(200).json({ success: true, message: "Đăng xuất thành công" });
};