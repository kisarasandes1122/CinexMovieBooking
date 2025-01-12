const express = require('express');
const router = express.Router();
const { createScreen,getScreens, getScreenById } = require('../controllers/screenController');

// Add a new screen
router.post('/', createScreen);

router.get('/', getScreens);

// Get a screen by ID
router.get('/:id', getScreenById);

module.exports = router;