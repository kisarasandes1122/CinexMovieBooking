import React, { useState, useEffect } from 'react';
import '../MovieList/MovieListSearchbar.css';

const MovieListSearchBar = ({ onSearch }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [secondSearch, setSecondSearch] = useState('');
  const [genres, setGenres] = useState([]);

   useEffect(() => {
     const fetchGenres = async () => {
      try {
          const response = await fetch('http://localhost:27017/api/movies') // Fetch all movies to get distinct genres
          if (!response.ok) {
            throw new Error('Failed to fetch movies for genres');
          }
          const data = await response.json();
          const uniqueGenres = [...new Set(data.reduce((acc, movie) => {
               if(movie.genres) {
                  return acc.concat(movie.genres.split(',').map(g => g.trim()))
               }
              return acc;
          }, []))];
        setGenres(uniqueGenres)
      } catch (error) {
          console.error('Error fetching movies for genres', error);
      }
      }
      fetchGenres()
   }, [])
   
  const handleApply = () => {
    onSearch(searchTitle, genre);
  };

  return (
    <div className="Searchbar-container">
      <div className="m-search-bar">
        <input
          type="text"
          placeholder="Search Movies"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="search-input-m"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="genre-select"
        >
           <option value="">Genre</option>
          {genres.map(g => (<option key={g} value={g}>{g}</option>))}
        </select>
        <button onClick={handleApply} className="apply-button">
          APPLY
        </button>
      </div>
    </div>
  );
};

export default MovieListSearchBar;