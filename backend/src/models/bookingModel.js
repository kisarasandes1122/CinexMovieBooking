const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    booking_date: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    ticketNo: {type: String}
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;