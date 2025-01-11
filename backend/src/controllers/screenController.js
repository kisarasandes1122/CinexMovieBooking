const Screen = require('../models/screenModel');
const Seat = require('../models/seatModel');

// Create a new screen
const createScreen = async (req, res) => {
  try{
      const { theatreId, screenNumber, format, rowCount, seatPerRow} = req.body;
      const screen = new Screen({
      theatreId,
       screenNumber,
       format,
       rowCount,
       seatPerRow
      })
     const newScreen = await screen.save();

     //generate seats
       const seats = generateSeats(newScreen._id, rowCount, seatPerRow)
     await Seat.insertMany(seats)
  res.status(201).json(newScreen);
}
catch(err){
   res.status(400).json({message: err.message});
 }
}

const getScreens = async (req, res) => {
  try {
    const screens = await Screen.find(); // Fetch all screens
    res.status(200).json(screens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


function generateSeats(screenId, rowCount, seatPerRow) {
 const seats = [];
   for (let row_num = 0; row_num < rowCount; row_num++) {
         const row_char = String.fromCharCode(65 + row_num); // Convert row number to character
         for (let seat_num = 1; seat_num <= seatPerRow; seat_num++) {
              const seatNumber = `${row_char}${seat_num}`;
            seats.push({
               screenId: screenId,
               seatNumber: seatNumber
          });
        }
    }
  return seats;
}


module.exports = {
  createScreen,
  getScreens, // Export the new controller
};