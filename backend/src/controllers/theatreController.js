const Theatre = require('../models/theatreModel');
const Screen = require('../models/screenModel'); // Import the Screen model

// Get all theatres with screen info
const getAllTheatresWithScreens = async (req, res) => {
    try {
        const theatres = await Theatre.find().populate({
            path: 'screens', // this is the virtual field in the Theatre model.
            select: 'screenNumber format rowCount seatPerRow'
        }).lean(); //use lean to convert mongoose object to javascript object
        res.json(theatres);
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}


// Get all theatres
const getAllTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find();
        res.json(theatres)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Create a new theatre
const createTheatre = async (req, res) => {
    const theatre = new Theatre(req.body)
    try {
        const newTheatre = await theatre.save();
        res.status(201).json(newTheatre);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

//get a theatre by id.
const getTheatreById = async (req, res) => {
    try {
        const theatre = await Theatre.findById(req.params.id);
        if (!theatre) {
            return res.status(404).json({ message: 'Cannot find theatre' })
        }
        res.json(theatre)
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// delete a theatre with screens
const deleteTheatreById = async (req, res) => {
    try {
        const theatreId = req.params.id;

        // Find the theatre first to check if exists
        const theatre = await Theatre.findById(theatreId);
        if (!theatre) {
            return res.status(404).json({ message: 'Cannot find theatre' });
        }

        // Delete associated screens
        await Screen.deleteMany({ theatreId: theatreId });

        // Delete the theatre itself
        await Theatre.findByIdAndDelete(theatreId);
        
        res.json({ message: 'Theatre and associated screens deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting theatre and screens', error: err.message });
    }
};


// Update a theatre
const updateTheatreById = async (req, res) => {
    try {
        const updatedTheatre = await Theatre.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!updatedTheatre) {
            return res.status(404).json({ message: 'Cannot find theatre' })
        }

        res.json(updatedTheatre);
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getAllTheatres,
    createTheatre,
    getTheatreById,
    deleteTheatreById,
    updateTheatreById,
    getAllTheatresWithScreens //Added this new controller
}