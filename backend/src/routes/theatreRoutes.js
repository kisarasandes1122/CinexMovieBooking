const express = require('express');
const router = express.Router();
const {
    getAllTheatres,
    createTheatre,
    getTheatreById,
    deleteTheatreById,
    updateTheatreById,
    getAllTheatresWithScreens // Added this
} = require('../controllers/theatreController');

// Get all theatres
router.get('/', getAllTheatres);

// New route for getting theatres with screens info
router.get('/with-screens', getAllTheatresWithScreens);

// Add a new theatre
router.post('/', createTheatre);
// Get a theatre by id
router.get('/:id', getTheatreById);
// Delete a theatre
router.delete('/:id', deleteTheatreById);
// Update a theatre
router.put('/:id', updateTheatreById);

module.exports = router;