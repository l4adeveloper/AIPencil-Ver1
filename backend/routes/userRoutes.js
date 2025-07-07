const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

// Yêu cầu có JWT + là management
function requireManagement(req, res, next) {
  if (req.user?.role !== 'management') {
    return res.status(403).json({ message: "Chỉ quản lý mới có quyền" });
  }
  next();
}

router.patch('/:id/approve', authenticateToken, requireManagement, userController.approveUser);
router.get('/pending', authenticateToken, requireManagement, userController.getPendingUsers);

module.exports = router;
