const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDetails, getTotalUserCount } = require('../controllers/authController');

// Register a new user
router.post('/register', registerUser)
// Login a user
router.post('/login', loginUser)

// Get total user count // ADD THIS LINE BEFORE THE PARAMETERIZED ID ROUTE
router.get('/count', getTotalUserCount);

// Get a user details
router.get('/:id', getUserDetails)


module.exports = router;