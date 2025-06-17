import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieListSearchBar from './MovieListSearchbar';
import '../MovieList/Movies.css';

const Movies = () => {
  const [filter, setFilter] = useState('Now Showing');
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  

    const fetchMovies = async () => {
        try {
        let url;
        if (filter === "Now Showing") {
           url = `https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api/movies/now-showing`;
        } else {
           url = `https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api/movies/coming-soon`;
        }

        const queryParams = new URLSearchParams();
        if(searchTitle) {
            queryParams.append('title', searchTitle);
        }
        if(searchGenre) {
             queryParams.append('genre', searchGenre);
        }
        
        const fullUrl = `${url}?${queryParams.toString()}`;
        
        const response = await fetch(fullUrl);

        if (!response.ok) {
        throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        setMovies(data);
        }
        catch (error) {
            console.error('Error fetching movies', error);
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