const mongoose = require('mongoose');

const showtimeSeatsSchema = new mongoose.Schema({
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seats', required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' }
});


const ShowtimeSeats = mongoose.model('Showtime_Seats', showtimeSeatsSchema);

module.exports = ShowtimeSeats;