const express = require('express');
const router = express.Router();
const {
    getAllMovies,
    getNowShowingMovies,
    getComingSoonMovies,
    createMovie,
    getMovieById,
    deleteMovieById,
    updateMovieById,
    getMovieByTitle // Import the new controller
} = require('../controllers/movieController');

// Get all movies
router.get('/', getAllMovies);

// Get Now Showing movies
router.get('/now-showing', getNowShowingMovies);

// Get Coming Soon movies
router.get('/coming-soon', getComingSoonMovies);

// Get movie by title
router.get('/title/:title', getMovieByTitle)

// Add a new movie.
router.post('/', createMovie);

//Get a movie by id
router.get('/:id', getMovieById);

 // Delete movie by id
router.delete('/:id', deleteMovieById);

 // Update a movie by ID
router.put('/:id', updateMovieById);

module.exports = router;