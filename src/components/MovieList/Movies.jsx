import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MovieList/Movies.css'

const Movies = () => {
  const [filter, setFilter] = useState("Now Showing");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url;
        if (filter === "Now Showing") {
          url = 'http://localhost:27017/api/movies/now-showing/'; 
        } else {
          url = 'http://localhost:27017/api/movies/coming-soon/'; 
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [filter]); 

  const handleClick = (movieTitle) => {
    const slug = movieTitle
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    navigate(`/movie/${slug}`);
  };

  return (
    <div className="app">
      <div className="titleandfilters">
        <h1 className="title">Movies</h1>
        <div className="filter-buttons">
          <button onClick={() => setFilter("Now Showing")}>Now Showing</button>
          <button onClick={() => setFilter("Coming Soon")}>Coming Soon</button>
        </div>
      </div>

      <div className="movies-list">
        {movies.map(movie => (
          <div key={movie._id} className="movie-card-m">
            <img src={movie.moviePosterHomepage} alt={movie.title} className="movie-poster-m" />
            <div className="movie-info-m">
              <h2>{movie.title}</h2>
              <p>{movie.duration} | {movie.releaseDate}</p>
              <p>{movie.description}</p>
              <div className="moviel-btns">
                <button onClick={() => handleClick(movie.title)}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;