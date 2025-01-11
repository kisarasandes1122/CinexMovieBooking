const express = require('express');
const router = express.Router();
const {
    getAllShowtimes,
    createShowtime,
    getShowtimeById,
    deleteShowtimeById,
    updateShowtimeById,
    getShowtimesByMovieTitleAndDate // Import the new controller
} = require('../controllers/showtimeController');


// Get all showtimes
router.get('/', getAllShowtimes);

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


module.exports = router;