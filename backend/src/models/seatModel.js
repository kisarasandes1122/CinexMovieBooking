const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screens', required: true },
  seatNumber: { type: String, required: true } // Modified to a String
});

 const Seat = mongoose.model('Seats', seatSchema);

module.exports = Seat;