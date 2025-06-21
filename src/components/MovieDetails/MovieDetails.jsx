import React, { useState, useEffect } from 'react';
import './MovieDetails.css';

const MovieDetails = ({ movie }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Check if movie is in favorites (from localStorage)
        const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
        setIsFavorite(favorites.some(fav => fav._id === movie?._id));
    }, [movie]);

    if (!movie) {
        return (
            <div className="movie-details-error">
                <div className="error-icon">🎬</div>
                <h2>No movie details to display</h2>
                <p>Please select a movie to view its details.</p>
            </div>
        );
    }

    const handleFavoriteToggle = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = favorites.filter(fav => fav._id !== movie._id);
        } else {
            updatedFavorites = [...favorites, movie];
        }

        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: movie.title,
                    text: `Check out ${movie.title} - ${movie.genres}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        if (duration.includes('h') || duration.includes('m')) {
            return duration;
        }
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
    };

    const formatReleaseDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRatingClass = (rating) => {
        if (!rating) return 'rating-default';
        const numRating = parseFloat(rating);
        if (numRating >= 8) return 'rating-excellent';
        if (numRating >= 7) return 'rating-good';
        if (numRating >= 6) return 'rating-average';
        return 'rating-poor';
    };

    const truncateText = (text, maxLength = 200) => {
        if (!text) return 'No description available.';
        if (text.length <= maxLength) return text;
        return isDescriptionExpanded ? text : `${text.substring(0, maxLength)}...`;
    };

    return (
        <div className="movie-details">
            <div className="movie-poster-container">
                {imageLoading && !imageError && (
                    <div className="poster-skeleton">
                        <span>Loading...</span>
                    </div>
                )}
                <img
                    src={imageError ? '/placeholder-movie.jpg' : movie.moviePosterHomepage}
                    alt={movie.title}
                    className={`movie-poster ${imageLoading ? 'loading' : ''}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                    }}
                />
                <div className="poster-overlay">
                    <button 
                        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                        onClick={handleFavoriteToggle}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>

            <div className="movie-info">
                <div className="movie-header">
                    <h1 className="movie-title">{movie.title}</h1>
                    <div className="movie-actions">
                        <button className="action-btn share-btn" onClick={handleShare} title="Share movie">
                            <span className="btn-icon">📤</span>
                            Share
                        </button>
                    </div>
                </div>

                <div className="movie-meta">
                    <div className="meta-item">
                        <span className="meta-label">Release Date</span>
                        <span className="meta-value">{formatReleaseDate(movie.releaseDate)}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Rating</span>
                        <span className={`meta-value rating ${getRatingClass(movie.rating)}`}>
                            ⭐ {movie.rating || 'N/A'}
                        </span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">Duration</span>
                        <span className="meta-value">{formatDuration(movie.duration)}</span>
                    </div>
                </div>

                <div className="movie-genre">
                    <span className="genre-label">Genres:</span>
                    <div className="genre-tags">
                        {movie.genres ? movie.genres.split(',').map((genre, index) => (
                            <span key={index} className="genre-tag">
                                {genre.trim()}
                            </span>
                        )) : <span className="genre-tag">Unknown</span>}
                    </div>
                </div>

                {movie.description && (
                    <div className="movie-description">
                        <h3>Plot Summary</h3>
                        <p className="description-text">
                            {truncateText(movie.description)}
                        </p>
                        {movie.description.length > 200 && (
                            <button 
                                className="expand-btn"
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            >
                                {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                    </div>
                )}

                {(movie.director || movie.cast) && (
                    <div className="movie-credits">
                        {movie.director && (
                            <div className="credit-item">
                                <span className="credit-label">Director:</span>
                                <span className="credit-value">{movie.director}</span>
                            </div>
                        )}
                        {movie.cast && (
                            <div className="credit-item">
                                <span className="credit-label">Cast:</span>
                                <span className="credit-value">{movie.cast}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="movie-stats">
                    <div className="stat-item">
                        <span className="stat-value">{movie.language || 'English'}</span>
                        <span className="stat-label">Language</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{movie.country || 'N/A'}</span>
                        <span className="stat-label">Country</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{movie.certification || 'NR'}</span>
                        <span className="stat-label">Certification</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;