import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieListSearchBar from './MovieListSearchbar';
import '../MovieList/Movies.css';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

const Movies = () => {
  const [filter, setFilter] = useState('Now Showing');
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  

    const fetchMovies = async () => {
        try {
            const params = {};
            if(searchTitle) {
                params.title = searchTitle;
            }
            if(searchGenre) {
                params.genre = searchGenre;
            }

            let response;
            if (filter === "Now Showing") {
                response = await apiService.movies.getNowShowing(params);
            } else {
                response = await apiService.movies.getComingSoon(params);
            }

            const data = response.data;
            // Ensure data is an array before setting movies
            if (Array.isArray(data)) {
                setMovies(data);
            } else {
                setMovies([]);
            }
        }
        catch (error) {
            const errorMessage = handleApiError(error, 'Failed to fetch movies');
            console.error('Error fetching movies', errorMessage);
            setMovies([]); // Set movies to empty array on error
        }
    }

  useEffect(() => {
    fetchMovies()
  }, [filter, searchTitle, searchGenre]);

  const handleSearch = (title, genre) => {
    setSearchTitle(title)
    setSearchGenre(genre)
  };


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
          <button onClick={() => setFilter('Now Showing')}>Now Showing</button>
          <button onClick={() => setFilter('Coming Soon')}>Coming Soon</button>
        </div>
      </div>
         <MovieListSearchBar onSearch={handleSearch} />

      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card-m">
            <img
              src={movie.moviePosterHomepage}
              alt={movie.title}
              className="movie-poster-m"
            />
            <div className="movie-info-m">
              <h2>{movie.title}</h2>
              <p>
                {movie.duration} | {movie.releaseDate}
              </p>
              <p>{movie.description}</p>
              <div className="moviel-btns">
                <button onClick={() => handleClick(movie.title)}>
                  Buy Tickets
                </button>
                <button onClick={() => handleClick(movie.title)}>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;