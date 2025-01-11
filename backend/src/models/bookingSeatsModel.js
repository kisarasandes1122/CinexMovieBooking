const mongoose = require('mongoose');

const bookingSeatsSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seats', required: true }
  });

const BookingSeats = mongoose.model('Booking_Seats', bookingSeatsSchema);

module.exports = BookingSeats;