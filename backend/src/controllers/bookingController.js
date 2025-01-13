const Booking = require('../models/bookingModel');
const shortid = require('shortid');
const Showtime = require('../models/showtimeModel');
const ShowtimeSeats = require('../models/showtimeSeatsModel');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { showtimeId, showtimeSeatIds, userId } = req.body;

         if(!showtimeId || !showtimeSeatIds || !userId){
           return res.status(400).json({ message: 'Missing required parameters' });
           }

        //Get showtime from showtime id
         const showtime = await Showtime.findById(showtimeId);
         if (!showtime) {
              return res.status(404).json({ message: 'Showtime not found' });
         }

         // Get all the seat price
         const seatPrice = showtime.seatPrice;

         const showtimeSeats =  await ShowtimeSeats.find({_id: {$in: showtimeSeatIds}})
            if(showtimeSeats.length !== showtimeSeatIds.length){
              return res.status(404).json({ message: 'Invalid Showtime Seat Id' });
            }

         //calculate total price
           const totalAmount =  seatPrice * showtimeSeatIds.length;

        const booking = new Booking({
            userId: userId,
            showtimeId: showtimeId,
             showtimeSeatIds: showtimeSeatIds,
            totalAmount: totalAmount,
            seatCount: showtimeSeatIds.length
           })

        booking.ticketNo = shortid.generate();
        const newBooking = await booking.save();

        // Update the seat status in showtime seat table
          await ShowtimeSeats.updateMany(
              { _id: { $in: showtimeSeatIds } },
              { status: 'booked' }
           );

         // Convert the Mongoose document to a plain JavaScript object and output
        const bookingObject = newBooking.toObject();
        res.status(201).json(bookingObject);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
}


//get all bookings
const getAllBookings = async (req, res) => {
    try{
        const bookings = await Booking.find();
        res.json(bookings);
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

//Get a specific booking by ID.
const getBookingById = async(req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message: 'Cannot find booking'})
        }
        res.json(booking)
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

// Delete a booking by ID
const deleteBookingById = async(req, res) =>{
    try{
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking){
            return res.status(404).json({message: 'Cannot find booking'})
        }
        res.json({message: 'Booking deleted'})
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    deleteBookingById
};