import React from 'react';
import './MovieDetails.css';

const MovieDetails = ({ movie }) => {
    if (!movie) {
        return <div>No movie details to display.</div>;
    }

    return (
        <div className="movie-details">
           <img
              src={movie.moviePosterHomepage}
              alt={movie.title}
              className="movie-poster"
           />
           <div className="movie-info">
              <h1>{movie.title}</h1>
              <div className="movie-meta">
                 <span>{new Date(movie.releaseDate).getFullYear()}</span>
                 <span className="dot">•</span>
                 <span>{movie.rating}</span>
                 <span className="dot">•</span>
                 <span>{movie.duration}</span>
              </div>
              <div className="movie-genre">
                <span>Genre: </span>
                 {movie.genres}
              </div>
           </div>
        </div>
    );
};

export default MovieDetails;