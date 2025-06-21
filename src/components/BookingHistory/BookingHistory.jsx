import React, { useState, useEffect, useMemo } from 'react';
import './BookingHistory.css';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

function BookingHistoryP() {
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve userId from localStorage when the component mounts
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('Please log in to view your booking history.');
        }
    }, []);

    useEffect(() => {
        // Fetch booking data only if there is a userId
        if (userId) {
            const fetchBookings = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await apiService.bookings.getByUserId(userId);
                    // Sort bookings by date (newest first)
                    const sortedBookings = response.data.sort((a, b) => 
                        new Date(b.booking_date) - new Date(a.booking_date)
                    );
                    setBookings(sortedBookings);
                } catch (error) {
                    const errorMessage = handleApiError(error);
                    setError(errorMessage);
                    console.error('Failed to fetch bookings:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBookings();
        }
    }, [userId]);

    // Calculate booking statistics
    const bookingStats = useMemo(() => {
        const total = bookings.length;
        const thisMonth = bookings.filter(booking => {
            const bookingDate = new Date(booking.booking_date);
            const now = new Date();
            return bookingDate.getMonth() === now.getMonth() && 
                   bookingDate.getFullYear() === now.getFullYear();
        }).length;
        const totalSeats = bookings.reduce((sum, booking) => sum + (booking.seats?.length || 0), 0);
        
        return { total, thisMonth, totalSeats };
    }, [bookings]);

    const handleBookingClick = (bookingId) => {
        navigate(`/Booking?bookingId=${bookingId}`);
    };

    const handleRetry = () => {
        setError(null);
        if (userId) {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Today, ${date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`;
        } else if (diffDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`;
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const getBookingStatus = (booking) => {
        // This is a placeholder - adjust based on your booking model
        const bookingDate = new Date(booking.booking_date);
        const now = new Date();
        
        if (booking.status) {
            return booking.status.toLowerCase();
        }
        
        // Default logic if no status field
        if (bookingDate > now) {
            return 'confirmed';
        } else {
            return 'completed';
        }
    };

    const getStatusDisplay = (status) => {
        const statusMap = {
            'confirmed': 'Confirmed',
            'pending': 'Pending',
            'cancelled': 'Cancelled',
            'completed': 'Completed'
        };
        return statusMap[status] || 'Unknown';
    };

    if (loading) {
        return (
            <div className="bkh-body">
                <div className="bkh-container">
                    <div className="bkh-booking-history">
                        <h2 className="bkh-title">Movie Booking History</h2>
                        <p className="bkh-subtitle">Your cinema journey at a glance</p>
                        <div className="bkh-title-line"></div>
                        <div className="bkh-loading">
                            <div className="bkh-spinner"></div>
                            <p className="bkh-loading-text">Loading your booking history...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bkh-body">
                <div className="bkh-container">
                    <div className="bkh-booking-history">
                        <h2 className="bkh-title">Movie Booking History</h2>
                        <p className="bkh-subtitle">Your cinema journey at a glance</p>
                        <div className="bkh-title-line"></div>
                        <div className="bkh-error">
                            <h3 className="bkh-error-title">Oops! Something went wrong</h3>
                            <p className="bkh-error-message">{error}</p>
                            {userId && (
                                <button className="bkh-retry-button" onClick={handleRetry}>
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bkh-body">
            <div className="bkh-container">
                <div className="bkh-booking-history">
                    <h2 className="bkh-title">Movie Booking History</h2>
                    <p className="bkh-subtitle">Your cinema journey at a glance</p>
                    <div className="bkh-title-line"></div>
                    
                    {bookings.length > 0 && (
                        <div className="bkh-stats">
                            <div className="bkh-stat-item">
                                <span className="bkh-stat-number">{bookingStats.total}</span>
                                <span className="bkh-stat-label">Total Bookings</span>
                            </div>
                            <div className="bkh-stat-item">
                                <span className="bkh-stat-number">{bookingStats.thisMonth}</span>
                                <span className="bkh-stat-label">This Month</span>
                            </div>
                            <div className="bkh-stat-item">
                                <span className="bkh-stat-number">{bookingStats.totalSeats}</span>
                                <span className="bkh-stat-label">Total Seats</span>
                            </div>
                        </div>
                    )}

                    <div className="bkh-bookings-list">
                        {bookings.length > 0 ? (
                            bookings.map((booking) => {
                                const status = getBookingStatus(booking);
                                return (
                                    <div
                                        key={booking._id}
                                        className="bkh-booking-card"
                                        onClick={() => handleBookingClick(booking._id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleBookingClick(booking._id);
                                            }
                                        }}
                                        aria-label={`View booking details for ${booking.showtimeId?.movieId?.title || 'Unknown Movie'}`}
                                    >
                                        <div className="bkh-booking-info">
                                            <div className="bkh-movie-title">
                                                {booking.showtimeId?.movieId?.title || 'Movie information unavailable'}
                                            </div>
                                            <div className="bkh-booking-details">
                                                <div className="bkh-detail-row">
                                                    <span className="bkh-cinema">
                                                        🎬 Screen {booking.showtimeId?.screenId?.screenNumber || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="bkh-detail-row">
                                                    <span className="bkh-date">
                                                        📅 {formatDate(booking.booking_date)}
                                                    </span>
                                                </div>
                                                {booking.seats && booking.seats.length > 0 && (
                                                    <div className="bkh-detail-row">
                                                        <span className="bkh-seats">
                                                            🪑 {booking.seats.length} seat{booking.seats.length > 1 ? 's' : ''}
                                                            {booking.seats.length <= 3 && (
                                                                ` (${booking.seats.map(seat => seat.seatNumber || seat).join(', ')})`
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="bkh-detail-row">
                                                    <span className={`bkh-status ${status}`}>
                                                        {getStatusDisplay(status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bkh-arrow"></div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bkh-empty">
                                <h3 className="bkh-empty-title">No bookings yet</h3>
                                <p className="bkh-empty-message">
                                    Looks like you haven't made any movie bookings yet. 
                                    Start exploring our movies and book your first show!
                                </p>
                                <button 
                                    className="bkh-retry-button" 
                                    onClick={() => navigate('/movies')}
                                >
                                    Browse Movies
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingHistoryP;