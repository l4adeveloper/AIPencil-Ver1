const { pool } = require('../config/db');
const { processSearchQuery } = require('./searchService');
// services/chatService.js

const db = require('../db');

// ==== AI CHAT (cũ) ====
// (giữ nguyên code AI chat của bạn ở đây nếu cần)

// ==== GROUP CHAT HANDLERS ====

// 1. Tạo nhóm chat mới
exports.createGroupChat = async (data, userId) => {
  const { name, description, department_id, is_department_group } = data;
  const groupRes = await db.query(
    `INSERT INTO group_chats (name, description, created_by, department_id, is_department_group)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, description, userId, department_id || null, is_department_group || false]
  );
  const group = groupRes.rows[0];

  await db.query(
    'INSERT INTO group_chat_members (group_chat_id, user_id, role) VALUES ($1, $2, $3)',
    [group.id, userId, 'admin']
  );
  return group;
};

// 2. Mời thành viên vào nhóm
exports.inviteMember = async (groupId, data) => {
  const { user_id, role } = data;
  const res = await db.query(
    `INSERT INTO group_chat_members (group_chat_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (group_chat_id, user_id) DO NOTHING
     RETURNING *`,
    [groupId, user_id, role || 'member']
  );
  return { success: true, member: res.rows[0] };
};

// 3. Xóa thành viên khỏi nhóm (hoặc tự rời nhóm)
exports.removeMember = async (groupId, userId) => {
  await db.query(
    `DELETE FROM group_chat_members WHERE group_chat_id = $1 AND user_id = $2`,
    [groupId, userId]
  );
  return { success: true };
};

// 4. Gửi tin nhắn (có hỗ trợ lên lịch)
exports.sendMessage = async (groupId, senderId, data) => {
  const { content, scheduled_at } = data;
  const is_sent = scheduled_at ? false : true;
  const sent_at = scheduled_at ? null : new Date();
  const res = await db.query(
    `INSERT INTO group_messages (group_chat_id, sender_id, content, scheduled_at, sent_at, is_sent)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [groupId, senderId, content, scheduled_at, sent_at, is_sent]
  );
  return res.rows[0];
};

// 5. Lấy danh sách tin nhắn nhóm
exports.getMessages = async (groupId) => {
  const res = await db.query(
    `SELECT * FROM group_messages WHERE group_chat_id = $1 AND is_sent = TRUE ORDER BY sent_at ASC`,
    [groupId]
  );
  return res.rows;
};
