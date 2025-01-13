// src/components/MoviePage.jsx
import React from 'react';
import './Moviesd.css';

const MovieDetail = () => {
  return (
    <div className="m-movie-container">
        <div className="m-movie-page">
            <h1>Spider-Man: Far from Home</h1>
            <div className="m-movie-info">
                <img
                src="path-to-your-image" 
                alt="Spider-Man: Far from Home"
                className="m-movie-poster"
                />
                <div className="m-movie-details">
                <button className="btn buy-tickets">Buy Tickets</button>
                <button className="btn watch-trailer">Watch Trailer</button>
                <div className="m-movie-meta">
                    <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (4.5/5)</p>
                    <p><strong>Genre:</strong> Action, Adventure, Sci-Fi</p>
                    <p><strong>Release Date:</strong> July 2, 2019</p>
                    <p><strong>Duration:</strong> 2h 9m</p>
                    <p><strong>Director:</strong> Jon Watts</p>
                    <p><strong>Cast:</strong> Tom Holland | Samuel L. Jackson | Jake Gyllenhaal</p>
                </div>
                <p className="m-movie-description">
                    Peter Parker, the beloved superhero Spider-Man, faces four destructive elemental monsters while on holiday in Europe. Soon, he receives help from Mysterio, a fellow hero with mysterious origins.
                </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MovieDetail;
