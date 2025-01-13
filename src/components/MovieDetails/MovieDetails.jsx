import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Ticket, Play } from 'lucide-react';
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

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`star ${i <= rating ? 'filled' : ''}`}
        />
      );
    }
    return stars;
  };

  if (!movie) {
    return (
      <div className="loading">
        <p>Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <div className="content">
        <div className="md-poster-container">
          <img
            src={movie.moviePoster}
            alt={movie.title}
            className="movie-poster"
          />
        </div>

        <div className="movie-info">
          <h1 className="title">{movie.title}</h1>
          
          <div className="meta">
            <span className="year">{new Date(movie.releaseDate).getFullYear()}</span>
            <span className="separator">•</span>
            <span className="rating">PG-13</span>
            <span className="separator">•</span>
            <span className="duration">
              <Clock className="icon" />
              {movie.duration}
            </span>
          </div>

          <div className="rating-container">
            <h3>Rating</h3>
            <div className="stars">
              {renderRating(4.5)}
              <span className="rating-text">(4.5/5)</span>
            </div>
          </div>

          <div className="details">
            <div className="detail-item">
              <h3>Genre</h3>
              <p>{movie.genres}</p>
            </div>

            <div className="detail-item">
              <h3>Release Date</h3>
              <p>{new Date(movie.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            <div className="detail-item">
              <h3>Duration</h3>
              <p>{movie.duration}</p>
            </div>
          </div>

          <div className="md-actions">
            <button className="btn primary">
              <Ticket className="icon" />
              Buy Tickets
            </button>
            <button className="btn secondary">
              <Play className="icon" />
              Watch Trailer
            </button>
          </div>

          <div className="synopsis">
            <h2>Synopsis</h2>
            <p>{movie.description || 
              "Peter Parker, the beloved superhero Spider-Man, faces four destructive elemental monsters while on holiday in Europe. Soon, he receives help from Mysterio, a fellow hero with mysterious origins."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;