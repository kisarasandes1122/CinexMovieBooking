const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBookingById, deleteBookingById, getBookingsByUserId } = require('../controllers/bookingController');

// Add a new booking
router.post('/', createBooking)
// Get all bookings
router.get('/', getAllBookings)
 // Get booking by id
router.get('/:id', getBookingById)
 // Delete booking by id
router.delete('/:id', deleteBookingById)
//Get booking by user id
router.get('/user/:userId', getBookingsByUserId);

module.exports = router;