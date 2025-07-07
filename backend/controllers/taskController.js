const { pool } = require('../config/db');

exports.createTask = async (req, res) => {
  const { department_id, assigned_to_user_id, description, due_date } = req.body;
  if (!department_id || !description) return res.status(400).json({ error: 'Thiếu thông tin' });
  try {
    const result = await pool.query(
      'INSERT INTO tasks (department_id, assigned_to_user_id, description, due_date) VALUES ($1,$2,$3,$4) RETURNING *',
      [department_id, assigned_to_user_id, description, due_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi createTask:', err.message);
    res.status(500).json({ error: 'Không thể tạo task' });
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    await pool.query('UPDATE tasks SET status=$1 WHERE id=$2', [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Lỗi updateStatus:', err.message);
    res.status(500).json({ error: 'Không thể cập nhật' });
  }
};

exports.listTasks = async (req, res) => {
  const departmentId = req.params.departmentId;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE department_id=$1 ORDER BY id', [departmentId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi listTasks:', err.message);
    res.status(500).json({ error: 'Không thể lấy danh sách' });
  }
};
