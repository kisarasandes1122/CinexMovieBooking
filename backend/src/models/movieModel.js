const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    cast: { type: String },
    director: {type: String},
    releaseDate: { type: String},
    duration: { type: String },
    rating: { type: String },
    genres: { type: String },
    imdbRating: {type: String},
    trailerURL: { type: String },
    moviePoster: { type: String },
    moviePosterHomepage: {type: String}
  });
  
  const Movie = mongoose.model('Movie', movieSchema);
  
  module.exports = Movie;