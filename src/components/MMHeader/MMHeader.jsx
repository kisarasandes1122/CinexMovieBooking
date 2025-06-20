import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MMHeader.css";
import { apiService } from "../../utils/axios";
import { handleApiError } from "../../utils/errorHandler";

const MMHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  };

  const handleCloseModal = () => {
      setShowForm(false);
      setError(null)
  };

 const handleGoToList = () => {
     setShowForm(false);
 }

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      try {
          const response = await apiService.movies.create(formData);
          setMovies((prevMovies) => [...prevMovies, response.data]);
          handleGoToList(); // Go to list view
         } catch (err) {
          const errorMessage = handleApiError(err, 'Failed to create movie');
          setError(errorMessage);
      }

  };

  if(loading){
      return <p>Loading Movies....</p>
  }

  if(error){
      return <p>Error: {error}</p>
  }


  return (
      <div className="movie-management-container">
          <div className="movie-management-header">
              <h2>Movie Management</h2>
              <button className="add-movie-btn" onClick={handleAddMovie}>
                  Add Movie
              </button>
          </div>
          <div className="search-bar-container">
              <input
                  type="text"
                  placeholder="Search Movies"
                  className="search-bar"
              />
          </div>

           {!showForm ? (
                 <div className="movie-list-container">
                       <h2>Movie List</h2>
                       {movies.length === 0 ? (
                           <p>No Movies Added Yet!</p>
                       ) : (
                           <ul className="movie-list">
                               {movies.map((movie) => (
                                   <li key={movie._id} className="movie-item">
                                       <h3>{movie.title}</h3>
                                       <p><strong>Description:</strong> {movie.description}</p>
                                       <p><strong>Cast:</strong> {movie.cast}</p>
                                       <p><strong>Director:</strong> {movie.director}</p>
                                       <p><strong>Release Date:</strong> {movie.releaseDate}</p>
                                       <p><strong>Duration:</strong> {movie.duration}</p>
                                       <p><strong>Rating:</strong> {movie.rating}</p>
                                       <p><strong>Genres:</strong> {movie.genres}</p>
                                       <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                                       <p><strong>Trailer URL:</strong> <a href={movie.trailerURL} target="_blank" rel="noopener noreferrer">Watch Trailer</a></p>
                                       <div className="poster-container">
                                           <img src={movie.moviePoster} alt={movie.title} className="movie-poster" />
                                           <img src={movie.moviePosterHomepage} alt={movie.title} className="movie-poster" />
                                       </div>
                                   </li>
                               ))}
                           </ul>
                       )}
                   </div>
           ) : (
              <div className="modal">
                  <div className="modal-content">
                      <h3>Add New Movie</h3>
                      {error && <p style={{ color: "red" }}>Error: {error}</p>}
                      <form onSubmit={handleSubmit}>
                          <div>
                              <label>Title</label>
                              <input
                                  type="text"
                                  placeholder="Enter movie title"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  required
                              />
                          </div>
                          <div>
                              <label>Description</label>
                              <textarea
                                  placeholder="Enter movie description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                              ></textarea>
                          </div>
                          <div>
                              <label>Cast (Comma - Separated)</label>
                              <input
                                  type="text"
                                  placeholder="Enter cast"
                                  name="cast"
                                  value={formData.cast}
                                  onChange={handleInputChange}
                              />
                          </div>

                          <div className="form-2lane">
                              <div>
                                  <label>Director</label>
                                  <input
                                      type="text"
                                      placeholder="Enter director"
                                      name="director"
                                      value={formData.director}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div>
                                  <label>Release Date</label>
                                  <input
                                      type="date"
                                      name="releaseDate"
                                      value={formData.releaseDate}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div>
                                  <label>Duration</label>
                                  <input
                                      type="text"
                                      placeholder="Enter duration"
                                      name="duration"
                                      value={formData.duration}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div>
                                  <label>Rating</label>
                                  <input
                                      type="text"
                                      placeholder="Enter rating"
                                      name="rating"
                                      value={formData.rating}
                                      onChange={handleInputChange}
                                  />
                              </div>
                              <div>
                                  <label>Genres</label>
                                  <Select
                                      isMulti
                                      options={genreOptions}
                                      value={selectedGenres}
                                      onChange={handleGenreChange}
                                      placeholder="Select genres"
                                  />
                              </div>
                              <div>
                                  <label>IMDB Ratings (Out of 5)</label>
                                  <input
                                      type="text"
                                      placeholder="Enter IMDB rating"
                                      name="imdbRating"
                                      value={formData.imdbRating}
                                      onChange={handleInputChange}
                                  />
                              </div>
                          </div>

                          <div>
                              <label>Trailer URL</label>
                              <input
                                  type="text"
                                  placeholder="Enter trailer URL"
                                  name="trailerURL"
                                  value={formData.trailerURL}
                                  onChange={handleInputChange}
                              />
                          </div>
                          <div>
                              <label>Movie Poster</label>
                              <input
                                  type="text"
                                  placeholder="Enter movie poster URL"
                                  name="moviePoster"
                                  value={formData.moviePoster}
                                  onChange={handleInputChange}
                              />
                          </div>
                          <div>
                              <label>Movie Poster (Home Page)</label>
                              <input
                                  type="text"
                                  placeholder="Enter homepage poster URL"
                                  name="moviePosterHomepage"
                                  value={formData.moviePosterHomepage}
                                  onChange={handleInputChange}
                              />
                          </div>
                          <div className="modal-actions">
                              <button
                                  type="button"
                                  className="cancel-btn"
                                  onClick={handleCloseModal}
                              >
                                  Cancel
                              </button>
                              <button type="submit" className="save-btn">
                                  Save
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