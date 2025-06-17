import React, { useState, useEffect } from 'react';
import ShowtimeSelector from '../Showtimes/ShowtimeSelector.jsx';
import '../MovieBooking/MovieBooking.css';
import { useParams } from 'react-router-dom';
import Showtime from '../Showtimes/Showtime.jsx';
import MovieDetails from '../MovieDetails/MovieDetails.jsx';

function createSlug(title) {
    if(!title) {
       return ''
    }
    return title
      .toLowerCase()
      .replace(/ /g, '-') // Replace spaces with hyphens
       .replace(/[^\w-]+/g, '')  //remove special characters
}


const MovieBooking = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api/movies`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const movie = data.find((movie) => createSlug(movie.title) === id);
                if (!movie) {
                    setError('Movie not found');
                    return;
                }
                setMovie(movie);
            }
            catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);


    if (loading) {
        return <div>Loading movie details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div>
            <div className="container">
                <Showtime />
                {movie && <MovieDetails movie={movie} />}
                <ShowtimeSelector />
            </div>
        </div>
    );
};

export default MovieBooking;