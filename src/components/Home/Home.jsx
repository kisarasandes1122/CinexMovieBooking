import React, { useState, useEffect } from "react";
import Homemain from "../Home/Homemain";
import { apiService } from "../../utils/axios";
import { handleApiError } from "../../utils/errorHandler";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const fetchFeaturedMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiService.movies.getNowShowing();
                
                // Ensure response.data is an array before setting movies
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setMovies(response.data);
                } else if (response.data && Array.isArray(response.data)) {
                    // Empty array case
                    setMovies([]);
                    setError('No movies found');
                } else {
                    // Non-array response case
                    setMovies([]);
                    setError('Invalid response format from server');
                }
            } catch (err) {
                const errorMessage = handleApiError(err, 'Failed to fetch featured movies');
                setError(errorMessage);
                setMovies([]); // Ensure movies remains an array even on error
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedMovies();
    }, []);

  useEffect(() => {
        if(movies.length > 0) {
            const interval = setInterval(() => {
                setActiveSlide((prevSlide) => (prevSlide + 1) % movies.length);
            }, 5000);
            return () => clearInterval(interval);
        }
  }, [movies]);

    if (loading) {
      return <div>Loading featured movies...</div>
    }

    if (error) {
       return <div>Error: {error}</div>
    }

  return (
    <div className="home-container">
      {movies.map((movie, index) => (
        <Homemain
          key={movie._id}
          movie={movie}
          isActive={index === activeSlide}
        />
      ))}
    </div>
  );
};

export default Home;