const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.patch('/:id/status', taskController.updateStatus);
router.get('/department/:departmentId', taskController.listTasks);

module.exports = router;
