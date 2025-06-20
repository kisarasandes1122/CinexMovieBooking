import React, { useState, useEffect } from "react";
import "./Home.css";
import { apiService } from "../../utils/axios";
import { handleApiError } from "../../utils/errorHandler";
import { Link, useNavigate } from "react-router-dom";
import { Play, Ticket, Star, Clock, Calendar, TrendingUp, Users, Award } from "lucide-react";

function createSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [featuredResponse, nowShowingResponse] = await Promise.all([
          apiService.movies.getNowShowing(),
          apiService.movies.getNowShowing()
        ]);

        if (Array.isArray(featuredResponse.data)) {
          setFeaturedMovies(featuredResponse.data.slice(0, 3));
        }
        if (Array.isArray(nowShowingResponse.data)) {
          setNowShowingMovies(nowShowingResponse.data.slice(0, 6));
          setComingSoonMovies(nowShowingResponse.data.slice(6, 10));
        }
      } catch (err) {
        setError(handleApiError(err, 'Failed to fetch movies'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setActiveHeroSlide((prev) => (prev + 1) % featuredMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies]);

  const stats = [
    { icon: <Users />, number: "500K+", label: "Happy Customers" },
    { icon: <Award />, number: "50+", label: "Partner Theaters" },
    { icon: <Ticket />, number: "1M+", label: "Tickets Booked" },
    { icon: <TrendingUp />, number: "24/7", label: "Customer Support" }
  ];

  if (loading) {
    return (
      <div className="hm-loading-container">
        <div className="hm-loading-spinner"></div>
        <p>Loading your cinematic experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hm-error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="hm-retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="hm-home-container">
      {/* Hero Section */}
      <section className="hm-hero-section">
        <div className="hm-hero-slider">
          {featuredMovies.map((movie, index) => (
            <div
              key={movie._id}
              className={`hm-hero-slide ${index === activeHeroSlide ? 'hm-active' : ''}`}
              style={{ backgroundImage: `url(${movie.moviePoster})` }}
            >
              <div className="hm-hero-overlay"></div>
              <div className="hm-hero-content">
                <div className="hm-hero-text">
                  <div className="hm-hero-badge">
                    <Star className="hm-star-icon" />
                    <span>Featured Movie</span>
                  </div>
                  <h1 className="hm-hero-title">{movie.title}</h1>
                  <p className="hm-hero-description">{movie.description}</p>
                  <div className="hm-movie-meta">
                    <span className="hm-meta-item">
                      <Clock size={16} />
                      {movie.duration}
                    </span>
                    <span className="hm-meta-item">
                      <Star size={16} />
                      {movie.rating}
                    </span>
                  </div>
                  <div className="hm-hero-actions">
                    <Link
                      to={`/booking/${createSlug(movie.title)}`}
                      className="hm-btn hm-btn-primary"
                    >
                      <Ticket size={20} />
                      Book Now
                    </Link>
                    <Link
                      to={`/${createSlug(movie.title)}`}
                      className="hm-btn hm-btn-secondary"
                    >
                      <Play size={20} />
                      Watch Trailer
                    </Link>
                  </div>
                </div>
                <div className="hm-hero-poster">
                  <img src={movie.moviePoster} alt={movie.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Hero Navigation */}
        <div className="hm-hero-navigation">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`hm-hero-dot ${index === activeHeroSlide ? 'hm-active' : ''}`}
              onClick={() => setActiveHeroSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="hm-stats-section">
        <div className="hm-container">
          <div className="hm-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="hm-stat-card">
                <div className="hm-stat-icon">{stat.icon}</div>
                <div className="hm-stat-content">
                  <h3 className="hm-stat-number">{stat.number}</h3>
                  <p className="hm-stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="hm-movies-section">
        <div className="hm-container">
          <div className="hm-section-header">
            <h2 className="hm-section-title">Now Showing</h2>
            <p className="hm-section-subtitle">
              Catch the latest blockbusters on the big screen
            </p>
            <Link to="/Moviepage" className="hm-view-all-btn">
              View All Movies
            </Link>
          </div>
          
          <div className="hm-movies-grid">
            {nowShowingMovies.map((movie) => (
              <div key={movie._id} className="hm-movie-card">
                <div className="hm-movie-poster">
                  <img src={movie.moviePosterHomepage || movie.moviePoster} alt={movie.title} />
                  <div className="hm-movie-overlay">
                    <button
                      onClick={() => navigate(`/booking/${createSlug(movie.title)}`)}
                      className="hm-book-btn"
                    >
                      <Ticket size={18} />
                      Book Now
                    </button>
                  </div>
                </div>
                <div className="hm-movie-info">
                  <h3 className="hm-movie-title">{movie.title}</h3>
                  <div className="hm-movie-details">
                    <span className="hm-duration">
                      <Clock size={14} />
                      {movie.duration}
                    </span>
                    <span className="hm-rating">
                      <Star size={14} />
                      {movie.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="hm-coming-soon-section">
        <div className="hm-container">
          <div className="hm-section-header">
            <h2 className="hm-section-title">Coming Soon</h2>
            <p className="hm-section-subtitle">
              Get ready for upcoming blockbusters
            </p>
          </div>
          
          <div className="hm-coming-soon-grid">
            {comingSoonMovies.map((movie, index) => (
              <div key={movie._id} className="hm-coming-soon-card">
                <div className="hm-coming-soon-image">
                  <img src={movie.moviePoster} alt={movie.title} />
                  <div className="hm-coming-soon-badge">
                    <Calendar size={16} />
                    Coming Soon
                  </div>
                </div>
                <div className="hm-coming-soon-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hm-cta-section">
        <div className="hm-container">
          <div className="hm-cta-content">
            <h2 className="hm-cta-title">Ready for Your Next Movie Adventure?</h2>
            <p className="hm-cta-description">
              Join millions of movie lovers and book your tickets today. 
              Experience cinema like never before with Cinex.
            </p>
            <div className="hm-cta-actions">
              <Link to="/Moviepage" className="hm-btn hm-btn-primary hm-btn-large">
                Explore Movies
              </Link>
              <Link to="/OffersPromotions" className="hm-btn hm-btn-outline hm-btn-large">
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;