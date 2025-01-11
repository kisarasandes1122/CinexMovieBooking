const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBookingById, deleteBookingById } = require('../controllers/bookingController');

// Add a new booking
router.post('/', createBooking)
// Get all bookings
router.get('/', getAllBookings)
 // Get booking by id
router.get('/:id', getBookingById)
 // Delete booking by id
router.delete('/:id', deleteBookingById)


module.exports = router;