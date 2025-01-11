const express = require('express');
const router = express.Router();
const { createScreen,getScreens } = require('../controllers/screenController');

// Add a new screen
router.post('/', createScreen);

router.get('/', getScreens);

module.exports = router;
