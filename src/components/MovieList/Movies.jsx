import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieListSearchBar from './MovieListSearchbar';
import './Movies.css';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';
import { Play, Ticket, Clock, Star, Calendar, Filter, Grid, List } from 'lucide-react';

function createSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

const Movies = () => {
  const [filter, setFilter] = useState('Now Showing');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'rating', 'duration', 'releaseDate'
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTitle) params.title = searchTitle;
      if (searchGenre) params.genre = searchGenre;

      let response;
      if (filter === "Now Showing") {
        response = await apiService.movies.getNowShowing(params);
      } else {
        response = await apiService.movies.getComingSoon(params);
      }

      const data = response.data;
      if (Array.isArray(data)) {
        setMovies(data);
        setFilteredMovies(data);
      } else {
        setMovies([]);
        setFilteredMovies([]);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch movies');
      setError(errorMessage);
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [filter, searchTitle, searchGenre]);

  useEffect(() => {
    let sorted = [...movies];
    
    switch (sortBy) {
      case 'title':
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        sorted = sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'duration':
        sorted = sorted.sort((a, b) => {
          const aDuration = parseInt(a.duration) || 0;
          const bDuration = parseInt(b.duration) || 0;
          return bDuration - aDuration;
        });
        break;
      case 'releaseDate':
        sorted = sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      default:
        break;
    }
    
    setFilteredMovies(sorted);
  }, [movies, sortBy]);

  const handleSearch = (title, genre) => {
    setSearchTitle(title);
    setSearchGenre(genre);
  };

  const handleMovieClick = (movieTitle) => {
    const slug = createSlug(movieTitle);
    navigate(`/movie/${slug}`);
  };

  const handleBooking = (e, movieTitle) => {
    e.stopPropagation();
    const slug = createSlug(movieTitle);
    navigate(`/booking/${slug}`);
  };

  if (loading) {
    return (
      <div className="ml-loading-container">
        <div className="ml-loading-spinner"></div>
        <h2>Loading Movies...</h2>
        <p>Discovering your next cinematic adventure</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchMovies} className="ml-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="ml-container">
      {/* Header Section */}
      <div className="ml-header">
        <div className="ml-title-section">
          <h1 className="ml-main-title">Movies</h1>
          <p className="ml-subtitle">
            Discover amazing movies and book your tickets
          </p>
        </div>
        
        <div className="ml-filter-section">
          <div className="ml-filter-tabs">
            <button 
              className={`ml-filter-tab ${filter === 'Now Showing' ? 'ml-active' : ''}`}
              onClick={() => setFilter('Now Showing')}
            >
              <Calendar size={18} />
              Now Showing
            </button>
            <button 
              className={`ml-filter-tab ${filter === 'Coming Soon' ? 'ml-active' : ''}`}
              onClick={() => setFilter('Coming Soon')}
            >
              <Clock size={18} />
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <MovieListSearchBar onSearch={handleSearch} />

      {/* Controls Section */}
      <div className="ml-controls">
        <div className="ml-results-info">
          <span className="ml-count">{filteredMovies.length} movies found</span>
        </div>
        
        <div className="ml-view-controls">
          <div className="ml-sort-dropdown">
            <Filter size={16} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="ml-sort-select"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="duration">Sort by Duration</option>
              <option value="releaseDate">Sort by Release Date</option>
            </select>
          </div>
          
          <div className="ml-view-toggle">
            <button 
              className={`ml-view-btn ${viewMode === 'grid' ? 'ml-active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button 
              className={`ml-view-btn ${viewMode === 'list' ? 'ml-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Movies Grid/List */}
      {filteredMovies.length === 0 ? (
        <div className="ml-no-results">
          <h3>No movies found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className={`ml-movies-container ${viewMode === 'list' ? 'ml-list-view' : 'ml-grid-view'}`}>
          {filteredMovies.map((movie) => (
            <div 
              key={movie._id} 
              className="ml-movie-card"
              onClick={() => handleMovieClick(movie.title)}
            >
              <div className="ml-movie-poster">
                <img
                  src={movie.moviePosterHomepage || movie.moviePoster}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450/731010/ffffff?text=No+Image';
                  }}
                />
                <div className="ml-movie-overlay">
                  <button 
                    className="ml-quick-book-btn"
                    onClick={(e) => handleBooking(e, movie.title)}
                  >
                    <Ticket size={18} />
                    Quick Book
                  </button>
                </div>
                {filter === 'Coming Soon' && (
                  <div className="ml-coming-soon-badge">
                    <Calendar size={14} />
                    Coming Soon
                  </div>
                )}
              </div>
              
              <div className="ml-movie-info">
                <h3 className="ml-movie-title">{movie.title}</h3>
                
                <div className="ml-movie-meta">
                  <span className="ml-meta-item">
                    <Clock size={14} />
                    {movie.duration}
                  </span>
                  {movie.rating && (
                    <span className="ml-meta-item">
                      <Star size={14} />
                      {movie.rating}
                    </span>
                  )}
                  {movie.releaseDate && (
                    <span className="ml-meta-item">
                      <Calendar size={14} />
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>

                {movie.genre && (
                  <div className="ml-genre-tags">
                    {movie.genre.split(',').slice(0, 2).map((genre, index) => (
                      <span key={index} className="ml-genre-tag">
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <p className="ml-movie-description">
                  {movie.description?.length > 120 
                    ? `${movie.description.substring(0, 120)}...` 
                    : movie.description}
                </p>

                <div className="ml-movie-actions">
                  <button 
                    className="ml-btn ml-btn-primary"
                    onClick={(e) => handleBooking(e, movie.title)}
                  >
                    <Ticket size={16} />
                    Book Tickets
                  </button>
                  <button 
                    className="ml-btn ml-btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMovieClick(movie.title);
                    }}
                  >
                    <Play size={16} />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;