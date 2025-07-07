const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

exports.login = async ({ email, password }) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) throw new Error('Email không tồn tại');

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error('Sai mật khẩu');

  // Có thể trả thêm token ở đây nếu dùng JWT
  return { id: user.id, email: user.email };

};  
