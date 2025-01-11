import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../css/Homenowshowing.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import nextArrow from '../../assets/arrownext.png';
import prevArrow from '../../assets/arrowprevios.png';

function createSlug(title) {
  if(!title) {
     return ''
  }
  return title
    .toLowerCase()
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')  //remove special characters
}


const Homenowshowing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await axios.get('http://localhost:27017/api/movies/now-showing/'); // Replace with your backend URL
         setMovies(response.data);
      } catch (err) {
          setError(err.message);
      } finally {
           setLoading(false);
      }
    };

    fetchNowShowingMovies();
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
        navigate('/all-movies'); // Navigate to the new page
    };


    if (loading) {
      return <div>Loading movies...</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

  return (
      <>
         <div className="movie-slider">
           <h2>Now Showing</h2>
            <Slider {...settings}>
                {movies.map((movie) => (
                    <div key={movie._id} className="movie-card">
                      <img src={movie.moviePosterHomepage} alt={movie.title} />
                      <h3>{movie.title}</h3>
                      <p>{movie.duration} | {movie.rating}</p>
                        <button onClick={() => navigate(`/booking/${createSlug(movie.title)}`)}>Buy Tickets</button>
                    </div>
                ))}
            </Slider>
            <div className="allmoviesbtn">
               <button className="show-all-btn" onClick={handleShowAllClick}>
                   Show All Movies
               </button>
            </div>
        </div>
        <hr />
     </>
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

export default Homenowshowing;