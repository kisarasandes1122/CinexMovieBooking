import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Homecomingsoon.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import nextArrow from '../../assets/arrownext.png';
import prevArrow from '../../assets/arrowprevios.png';

const Homecomingsoon = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchComingSoonMovies = async () => {
        setLoading(true);
        setError(null);
      try {
        const response = await axios.get('http://localhost:27017/api/movies/coming-soon/'); // Replace with your backend URL
        setMovies(response.data);
      } catch (err) {
          setError(err.message)
      } finally {
         setLoading(false);
      }
    };
    fetchComingSoonMovies();
  }, []);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

   const handleShowAllClick = () => {
        navigate('/Moviepage'); // Navigate to the new page
   };


    if (loading) {
        return <div>Loading movies...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

  return (
    <div className="movie-slider">
      <h2>Coming Soon</h2>
      <Slider {...settings}>
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card-c">
            <img src={movie.moviePosterHomepage} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>{movie.duration} | {movie.rating}</p>
            <p>{movie.releaseDate}</p>
          </div>
        ))}
      </Slider>
      <div className="allmoviesbtn">
        <button className="show-all-btn" onClick={handleShowAllClick}>
          Show All Movies
        </button>
      </div>
    </div>
  );
};

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div className="arrow next" onClick={onClick}>
      <img className='nextarrow' src={nextArrow} alt="Next" />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div className="arrow prev" onClick={onClick}>
      <img className='prevarrow' src={prevArrow} alt="Previous" />
    </div>
  );
}

export default Homecomingsoon;