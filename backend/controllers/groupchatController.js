const { pool } = require('../config/db');
const { processSearchQuery } = require('./searchService');
const groupchatService = require('../services/groupchatService'); 

//tạo nhóm chat
exports.createGroupChat = async (req, res) => {
  try {
    const group = await chatService.createGroupChat(req.body, req.user.id);
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// mời tham gia nhóm chat
exports.inviteMember = async (req, res) => {
  try {
    const groupId = req.params.id;
    const member = await chatService.inviteMember(groupId, req.body);
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//xóa thành viên khỏi nhóm chat
exports.removeMember = async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;
    const result = await chatService.removeMember(groupId, userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//rời nhóm chat
exports.leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    const result = await chatService.removeMember(groupId, userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
//gửi tin nhắn
exports.sendMessage = async (req, res) => {
  try {
    const groupId = req.params.id;
    const senderId = req.user.id;
    const message = await chatService.sendMessage(groupId, senderId, req.body);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// lấy danh sách tin nhắn
exports.getMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const messages = await chatService.getMessages(groupId);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};