const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/', profileController.upsertProfile);
router.get('/:userId', profileController.getProfile);

module.exports = router;
