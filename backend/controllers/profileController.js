const { pool } = require('../config/db');

exports.upsertProfile = async (req, res) => {
  const { user_id, name, position, department_id } = req.body;
  if (!user_id || !name) return res.status(400).json({ error: 'Thiếu thông tin người dùng' });
  try {
    const existing = await pool.query('SELECT id FROM employee_profiles WHERE user_id=$1', [user_id]);
    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE employee_profiles SET name=$1, position=$2, department_id=$3, first_login_complete=true WHERE user_id=$4',
        [name, position, department_id, user_id]
      );
    } else {
      await pool.query(
        'INSERT INTO employee_profiles (user_id, name, position, department_id, first_login_complete) VALUES ($1,$2,$3,$4,true)',
        [user_id, name, position, department_id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi upsertProfile:', err.message);
    res.status(500).json({ error: 'Không thể lưu thông tin' });
  }
};

exports.getProfile = async (req, res) => {
 // const userId = req.params.userId;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    if (result.rows.length === 0) return res.json(null);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi getProfile:', err.message);
    res.status(500).json({ error: 'Không thể lấy thông tin' });
  }
};
