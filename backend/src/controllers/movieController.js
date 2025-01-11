const Movie = require('../models/movieModel');

function createSlug(title) {
    if(!title) {
       return ''
    }
    return title
      .toLowerCase()
      .replace(/ /g, '-') // Replace spaces with hyphens
       .replace(/[^\w-]+/g, '')  //remove special characters
}

// Get Now Showing Movies
const getNowShowingMovies = async (req, res) => {
  try {
    const now = new Date(); // Current date and time
    const movies = await Movie.find();
     const nowShowing = movies.filter(movie => new Date(movie.releaseDate) <= now);
     res.json(nowShowing);
    }
    catch(err){
      res.status(500).json({message: err.message});
    }
};

// Get Coming Soon Movies
const getComingSoonMovies = async (req, res) => {
    try {
        const now = new Date(); // Current date and time
        const movies = await Movie.find();
         const comingSoon = movies.filter(movie => new Date(movie.releaseDate) > now);
         res.json(comingSoon);
       }
      catch(err){
        res.status(500).json({message: err.message});
      }
};


 //Get all movies
 const getAllMovies = async (req, res) => {
    try {
         const movies = await Movie.find();
        res.json(movies)
      }
    catch(err) {
         res.status(500).json({message: err.message})
    }
 }

// Get a movie by title
const getMovieByTitle = async (req, res) => {
    try {
      const { title } = req.params; // Get title from url
      const movies = await Movie.find();
      const movie = movies.find((movie) => createSlug(movie.title) === title);

       if (!movie) {
           return res.status(404).json({ message: 'Cannot find movie' });
        }
        res.json(movie);
    } catch (err) {
         return res.status(500).json({ message: err.message });
    }
};


// Existing code for createMovie, getMovieById, deleteMovieById, updateMovieById

    // Create a new movie
    const createMovie = async (req, res) => {
      const movie = new Movie(req.body)
      try{
          const newMovie = await movie.save();
          res.status(201).json(newMovie);
      }
      catch(err){
        res.status(400).json({message: err.message});
      }
    }


   //get movie by id
   const getMovieById = async(req, res) => {
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie){
             return res.status(404).json({message: 'Cannot find movie'})
        }
        res.json(movie)
     }
     catch(err){
         return res.status(500).json({message: err.message})
     }
   }



   // Delete a movie by ID
   const deleteMovieById = async(req, res) =>{
      try{
        const movie = await Movie.findByIdAndDelete(req.params.id);
         if(!movie){
              return res.status(404).json({message: 'Cannot find movie'})
        }
        res.json({message: 'Movie deleted'})
     }
     catch(err){
         return res.status(500).json({message: err.message})
     }
   }

  // Update a movie
  const updateMovieById = async (req, res) => {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
           req.params.id,
            req.body,
           { new: true } //Returns updated object
       )

       if(!updatedMovie){
            return res.status(404).json({message: 'Cannot find movie'})
         }

      res.json(updatedMovie);
     }
     catch (err) {
          return res.status(500).json({message: err.message})
      }
   }
module.exports = {
    getComingSoonMovies,
    getNowShowingMovies,
    getAllMovies,
    createMovie,
    getMovieById,
    deleteMovieById,
    updateMovieById,
    getMovieByTitle
  };