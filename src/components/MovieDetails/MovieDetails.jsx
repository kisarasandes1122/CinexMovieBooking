import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const { title } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:27017/api/movies/title/${title}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [title]);

  if (!movie) {
    return <div>Loading movie details...</div>;
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