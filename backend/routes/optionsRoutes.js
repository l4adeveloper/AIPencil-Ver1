const express = require('express');
const router = express.Router();
const optionsController = require('../controllers/optionsController');

router.post('/', optionsController.saveOptions);
router.get('/', optionsController.getOptions);

module.exports = router;
