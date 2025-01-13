const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDetails } = require('../controllers/authController');


// Register a new user
router.post('/register', registerUser)
// Login a user
router.post('/login', loginUser)
// Get a user details
router.get('/:id', getUserDetails)


module.exports = router;