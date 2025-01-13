const express = require('express');
const router = express.Router();
const {
  getShowtimesByMovieTitleAndDate,
    createShowtime,
    getShowtimeById,
    deleteShowtimeById,
    updateShowtimeById,
    getShowtimeSeatsByShowtimeId,
    getShowtimeSeatsByShowtimeSeatId, // Import the new controller
    getAllShowtimes //Import the new controller to get all showtimes
} = require('../controllers/showtimeController');


//Get showtime by movie title and date
router.get('/search', getShowtimesByMovieTitleAndDate);

// Add a new showtime.
router.post('/', createShowtime)
// Get a showtime by Id
router.get('/:id', getShowtimeById)
// Get All showtimes
router.get('/',getAllShowtimes)
 // Delete a showtime by ID
router.delete('/:id', deleteShowtimeById)
// update a showtime by ID.
router.put('/:id', updateShowtimeById)


// Get showtime seats by showtime ID
router.get('/:showtimeId/seats', getShowtimeSeatsByShowtimeId); //New route

// New route to get showtime seats by showtimeSeatIds
router.get('/seats/search', getShowtimeSeatsByShowtimeSeatId);


module.exports = router;
