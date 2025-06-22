import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MMHeader.css";
import { apiService } from "../../utils/axios";
import { handleApiError } from "../../utils/errorHandler";

const MMHeader = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [formData, setFormData] = useState({
      title: "",
      description: "",
      cast: "",
      director: "",
      releaseDate: "",
      duration: "",
      rating: "",
      genres: "",
      imdbRating: "",
      trailerURL: "",
      moviePoster: "",
      moviePosterHomepage: "",
  });
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const genreOptions = [
      { value: "action", label: "Action" },
      { value: "animation", label: "Animation" },
      { value: "comedy", label: "Comedy" },
      { value: "crime", label: "Crime" },
      { value: "drama", label: "Drama" },
      { value: "fantasy", label: "Fantasy" },
      { value: "horror", label: "Horror" },
      { value: "romance", label: "Romance" },
      { value: "sci-fi", label: "Science Fiction" },
      { value: "thriller", label: "Thriller" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(115, 16, 16, 0.3)',
      color: 'white',
      minHeight: '45px',
      '&:hover': {
        borderColor: '#731010',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1F1F1F',
      border: '1px solid rgba(115, 16, 16, 0.3)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#731010' : state.isFocused ? 'rgba(115, 16, 16, 0.2)' : 'transparent',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgba(115, 16, 16, 0.3)',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(115, 16, 16, 0.8)',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white',
      '&:hover': {
        backgroundColor: '#8B1A1A',
        color: 'white',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };

  useEffect(() => {
      const fetchMovies = async () => {
          setLoading(true);
          setError(null);
          try {
              const response = await apiService.movies.getAll();
              setMovies(response.data);
          }
          catch (err) {
              const errorMessage = handleApiError(err, 'Failed to fetch movies');
              setError(errorMessage);
          }
          finally{
              setLoading(false);
          }
      };
      fetchMovies();
  }, []);

  const handleGenreChange = (selectedOptions) => {
      setSelectedGenres(selectedOptions || []);
      setFormData({
          ...formData,
          genres: selectedOptions ? selectedOptions.map((option) => option.value).join(",") : ""
      })
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleAddMovie = () => {
      setShowForm(true);
      setError(null);
  };

  const handleCloseModal = () => {
      setShowForm(false);
      setError(null);
      setFormData({
          title: "",
          description: "",
          cast: "",
          director: "",
          releaseDate: "",
          duration: "",
          rating: "",
          genres: "",
          imdbRating: "",
          trailerURL: "",
          moviePoster: "",
          moviePosterHomepage: "",
      });
      setSelectedGenres([]);
      setEditingMovie(null);
  };

  const handleEditMovie = (movie) => {
      setEditingMovie(movie);
      setFormData({
          title: movie.title,
          description: movie.description,
          cast: movie.cast,
          director: movie.director,
          releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : "",
          duration: movie.duration,
          rating: movie.rating,
          genres: movie.genres,
          imdbRating: movie.imdbRating,
          trailerURL: movie.trailerURL,
          moviePoster: movie.moviePoster,
          moviePosterHomepage: movie.moviePosterHomepage,
      });
      
      // Set selected genres for multi-select
      const movieGenres = movie.genres ? movie.genres.split(',').map(genre => {
          const option = genreOptions.find(opt => opt.value.toLowerCase() === genre.trim().toLowerCase());
          return option || { value: genre.trim().toLowerCase(), label: genre.trim() };
      }).filter(genre => genre.value) : [];
      setSelectedGenres(movieGenres);
      setShowForm(true);
      setError(null);
  };

  const handleDeleteMovie = async (movieId) => {
      if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
          return;
      }

      setDeleting(movieId);
      try {
          await apiService.movies.delete(movieId);
          setMovies((prevMovies) => prevMovies.filter(movie => movie._id !== movieId));
      } catch (err) {
          const errorMessage = handleApiError(err, 'Failed to delete movie');
          setError(errorMessage);
      } finally {
          setDeleting(null);
      }
  };

  const handleGoToList = () => {
     setShowForm(false);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);
      try {
          if (editingMovie) {
              // Update existing movie
              const response = await apiService.movies.update(editingMovie._id, formData);
              setMovies((prevMovies) => 
                  prevMovies.map(movie => 
                      movie._id === editingMovie._id ? response.data : movie
                  )
              );
          } else {
              // Create new movie
              const response = await apiService.movies.create(formData);
              setMovies((prevMovies) => [...prevMovies, response.data]);
          }
          handleCloseModal();
      } catch (err) {
          const errorMessage = handleApiError(err, editingMovie ? 'Failed to update movie' : 'Failed to create movie');
          setError(errorMessage);
      } finally {
          setSubmitting(false);
      }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.cast.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(loading){
      return (
        <div className="mm-loading-container">
          <div className="mm-loading-spinner"></div>
          <p>Loading Movies...</p>
        </div>
      );
  }

  if(error && !showForm){
      return (
        <div className="mm-error-container">
          <div className="mm-error-icon">⚠️</div>
          <h2>Error Loading Movies</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mm-retry-btn">
            Retry
          </button>
        </div>
      );
  }

  return (
      <div className="mm-container">
          <div className="mm-header">
              <div className="mm-header-content">
                  <h1>Movie Management</h1>
                  <p>Manage your cinema's movie collection</p>
              </div>
              <button className="mm-add-btn" onClick={handleAddMovie}>
                  <span className="mm-btn-icon">🎬</span>
                  Add Movie
              </button>
          </div>

          {!showForm && (
              <div className="mm-search-container">
                  <div className="mm-search-wrapper">
                      <span className="mm-search-icon">🔍</span>
                      <input
                          type="text"
                          placeholder="Search movies by title, director, or cast..."
                          className="mm-search-input"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </div>
          )}

           {!showForm ? (
                 <div className="mm-movies-section">
                       <div className="mm-movies-header">
                           <h2>Movie Collection ({filteredMovies.length})</h2>
                       </div>
                       {filteredMovies.length === 0 ? (
                           <div className="mm-empty-state">
                               <div className="mm-empty-icon">🎬</div>
                               <h3>No Movies Found</h3>
                               <p>{searchTerm ? 'No movies match your search criteria' : 'Start by adding your first movie'}</p>
                           </div>
                       ) : (
                           <div className="mm-movies-grid">
                               {filteredMovies.map((movie) => (
                                   <div key={movie._id} className="mm-movie-card">
                                       <div className="mm-movie-poster-container">
                                           <img 
                                               src={movie.moviePoster} 
                                               alt={movie.title} 
                                               className="mm-movie-poster"
                                               onError={(e) => {
                                                   e.target.src = '/placeholder-movie.jpg';
                                               }}
                                           />
                                           <div className="mm-movie-overlay">
                                               <div className="mm-movie-rating">
                                                   ⭐ {movie.imdbRating}/5
                                               </div>
                                           </div>
                                       </div>
                                       <div className="mm-movie-info">
                                           <h3 className="mm-movie-title">{movie.title}</h3>
                                           <p className="mm-movie-director">Dir: {movie.director}</p>
                                           <p className="mm-movie-duration">{movie.duration} • {movie.rating}</p>
                                           <p className="mm-movie-genres">{movie.genres}</p>
                                           <p className="mm-movie-description">{movie.description}</p>
                                           <div className="mm-movie-actions">
                                               <a 
                                                   href={movie.trailerURL} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   className="mm-trailer-btn"
                                               >
                                                   ▶️ Trailer
                                               </a>
                                               <button
                                                   className="mm-edit-btn"
                                                   onClick={() => handleEditMovie(movie)}
                                                   disabled={deleting === movie._id}
                                               >
                                                   ✏️ Edit
                                               </button>
                                               <button
                                                   className="mm-delete-btn"
                                                   onClick={() => handleDeleteMovie(movie._id)}
                                                   disabled={deleting === movie._id}
                                               >
                                                   {deleting === movie._id ? (
                                                       <>
                                                           <span className="mm-spinner"></span>
                                                           Deleting...
                                                       </>
                                                   ) : (
                                                       <>🗑️ Delete</>
                                                   )}
                                               </button>
                                           </div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
           ) : (
              <div className="mm-modal-overlay">
                  <div className="mm-modal-content">
                      <div className="mm-modal-header">
                          <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                          <button className="mm-modal-close" onClick={handleCloseModal}>×</button>
                      </div>
                      
                      {error && (
                          <div className="mm-error-message">
                              <span className="mm-error-icon">⚠️</span>
                              {error}
                          </div>
                      )}
                      
                      <form onSubmit={handleSubmit} className="mm-form">
                          <div className="mm-form-group">
                              <label className="mm-label">Movie Title *</label>
                              <input
                                  type="text"
                                  placeholder="Enter movie title"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  className="mm-input"
                                  required
                              />
                          </div>

                          <div className="mm-form-group">
                              <label className="mm-label">Description</label>
                              <textarea
                                  placeholder="Enter movie description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                  className="mm-textarea"
                                  rows="4"
                              />
                          </div>

                          <div className="mm-form-group">
                              <label className="mm-label">Cast (Comma-separated)</label>
                              <input
                                  type="text"
                                  placeholder="Enter cast members"
                                  name="cast"
                                  value={formData.cast}
                                  onChange={handleInputChange}
                                  className="mm-input"
                              />
                          </div>

                          <div className="mm-form-row">
                              <div className="mm-form-group">
                                  <label className="mm-label">Director</label>
                                  <input
                                      type="text"
                                      placeholder="Enter director name"
                                      name="director"
                                      value={formData.director}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                              <div className="mm-form-group">
                                  <label className="mm-label">Release Date</label>
                                  <input
                                      type="date"
                                      name="releaseDate"
                                      value={formData.releaseDate}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                          </div>

                          <div className="mm-form-row">
                              <div className="mm-form-group">
                                  <label className="mm-label">Duration</label>
                                  <input
                                      type="text"
                                      placeholder="e.g., 2h 30m"
                                      name="duration"
                                      value={formData.duration}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                              <div className="mm-form-group">
                                  <label className="mm-label">Rating</label>
                                  <input
                                      type="text"
                                      placeholder="e.g., PG-13"
                                      name="rating"
                                      value={formData.rating}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                          </div>

                          <div className="mm-form-row">
                              <div className="mm-form-group">
                                  <label className="mm-label">Genres</label>
                                  <Select
                                      isMulti
                                      options={genreOptions}
                                      value={selectedGenres}
                                      onChange={handleGenreChange}
                                      placeholder="Select genres"
                                      styles={customSelectStyles}
                                      className="mm-select"
                                  />
                              </div>
                              <div className="mm-form-group">
                                  <label className="mm-label">IMDB Rating (1-5)</label>
                                  <input
                                      type="number"
                                      min="1"
                                      max="5"
                                      step="0.1"
                                      placeholder="e.g., 4.5"
                                      name="imdbRating"
                                      value={formData.imdbRating}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                          </div>

                          <div className="mm-form-group">
                              <label className="mm-label">Trailer URL</label>
                              <input
                                  type="url"
                                  placeholder="Enter YouTube or trailer URL"
                                  name="trailerURL"
                                  value={formData.trailerURL}
                                  onChange={handleInputChange}
                                  className="mm-input"
                              />
                          </div>

                          <div className="mm-form-row">
                              <div className="mm-form-group">
                                  <label className="mm-label">Movie Poster URL</label>
                                  <input
                                      type="url"
                                      placeholder="Enter poster image URL"
                                      name="moviePoster"
                                      value={formData.moviePoster}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                              <div className="mm-form-group">
                                  <label className="mm-label">Homepage Poster URL</label>
                                  <input
                                      type="url"
                                      placeholder="Enter homepage poster URL"
                                      name="moviePosterHomepage"
                                      value={formData.moviePosterHomepage}
                                      onChange={handleInputChange}
                                      className="mm-input"
                                  />
                              </div>
                          </div>

                          <div className="mm-form-actions">
                              <button
                                  type="button"
                                  className="mm-cancel-btn"
                                  onClick={handleCloseModal}
                                  disabled={submitting}
                              >
                                  Cancel
                              </button>
                              <button 
                                  type="submit" 
                                  className="mm-save-btn"
                                  disabled={submitting}
                              >
                                  {submitting ? (
                                      <>
                                          <span className="mm-spinner"></span>
                                          {editingMovie ? 'Updating...' : 'Saving...'}
                                      </>
                                  ) : (
                                      <>
                                          <span className="mm-btn-icon">💾</span>
                                          {editingMovie ? 'Update Movie' : 'Save Movie'}
                                      </>
                                  )}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </div>
  );
};

export default MMHeader;