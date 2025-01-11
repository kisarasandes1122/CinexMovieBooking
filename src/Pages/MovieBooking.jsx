import React, { useState, useEffect } from 'react';
import Header from '../../src/components/Yokis/Header';
import Breadcrumb from '../../src/components/Jayshowtimes/Breadcrumb';
import MovieDetails from '../../src/components/Jayshowtimes/MovieDetails';
import ShowtimeSelector from '../../src/components/Jayshowtimes/ShowtimeSelector';
import '../css/MovieBooking.css';
import { useParams } from 'react-router-dom';

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
                const response = await fetch(`http://localhost:27017/api/movies`);
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
            <Header />
            <div className="container">
                <Breadcrumb />
                {movie && <MovieDetails movie={movie} />}
                <ShowtimeSelector />
            </div>
        </div>
    );
};

export default MovieBooking;