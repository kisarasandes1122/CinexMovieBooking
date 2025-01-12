const express = require('express');
const router = express.Router();
const {
  getShowtimesByMovieTitleAndDate,
    createShowtime,
    getShowtimeById,
    deleteShowtimeById,
    updateShowtimeById,
    getShowtimeSeatsByShowtimeId // Import the new controller
} = require('../controllers/showtimeController');


//Get showtime by movie title and date
router.get('/search', getShowtimesByMovieTitleAndDate);

// Add a new showtime.
router.post('/', createShowtime)
// Get a showtime by Id
router.get('/:id', getShowtimeById)
 // Delete a showtime by ID
router.delete('/:id', deleteShowtimeById)
// update a showtime by ID.
router.put('/:id', updateShowtimeById)


// Get showtime seats by showtime ID
router.get('/:showtimeId/seats', getShowtimeSeatsByShowtimeId); //New route

module.exports = router;