import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingSuccess.css';

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Debug: Log the location state to see what data is being passed
  console.log('BookingSuccess - location.state:', location.state);
  
  // Get data from navigation state (from new payment flow) or use defaults
  const {
    booking,
    movieTitle,
    selectedDate,
    selectedTime,
    selectedSeats,
    totalAmount,
    userDetails,
    showtimeDetails
  } = location.state || {};

  // Debug: Log individual values
  console.log('BookingSuccess - booking:', booking);
  console.log('BookingSuccess - movieTitle:', movieTitle);
  console.log('BookingSuccess - userDetails:', userDetails);

  // Default fallback data for backward compatibility
  const displayData = {
    movieTitle: movieTitle || 'Spider-Man: Far from Home',
    theatreLocation: showtimeDetails?.screenId?.theatreId?.location || 'CINEX - Bambalapitiya',
    screenNumber: showtimeDetails?.screenId?.screenNumber || '02',
    ticketNo: booking?.ticketNo || 'WMGH8LK',
    ticketCount: selectedSeats?.length || booking?.seatCount || 4,
    seats: selectedSeats?.join(', ') || 'C3, C5, E5, F1',
    date: selectedDate || 'Fri, 27 Jan',
    time: selectedTime || '9:00 AM',
    totalAmount: totalAmount || 4643,
    customerName: userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Kisara Sandes',
    customerMobile: userDetails?.mobile || '0789200730',
    customerEmail: userDetails?.email || 'kisarasandes22@gmail.com'
  };
  
  // Debug: Log display data
  console.log('BookingSuccess - displayData:', displayData);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/bookinghistory');
  };

  return (
    <div className="booking-container">
      <div className="booking-content">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Booking Confirmed!</h1>
          <p className="success-subtitle">Your movie tickets have been successfully booked</p>
        </div>

        <div className="movie-info">
          <h2 className="movie-title">{displayData.movieTitle}</h2>
          <p className="theatre-location">{displayData.theatreLocation}</p>
        </div>

        <div className="ticket-details">
          <div className="detail-item">
            <span className="label">Ticket No:</span> 
            <span className="value">{displayData.ticketNo}</span>
          </div>
          <div className="detail-item">
            <span className="label">Tickets:</span> 
            <span className="value">{displayData.ticketCount}</span>
          </div>
          <div className="detail-item">
            <span className="label">Screen:</span> 
            <span className="value">{displayData.screenNumber}</span>
          </div>
          <div className="detail-item">
            <span className="label">Seats:</span> 
            <span className="value">{displayData.seats}</span>
          </div>
          <div className="detail-item">
            <span className="label">Date:</span> 
            <span className="value">{displayData.date}</span>
          </div>
          <div className="detail-item">
            <span className="label">Time:</span> 
            <span className="value">{displayData.time}</span>
          </div>
          <div className="detail-item total-amount">
            <span className="label">Total Amount:</span> 
            <span className="value">Rs. {displayData.totalAmount}</span>
          </div>
        </div>

        <div className="customer-info">
          <h3 className="section-title">Customer Information</h3>
          <div className="detail-item">
            <span className="label">Customer Name:</span> 
            <span className="value">{displayData.customerName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Customer Mobile:</span> 
            <span className="value">{displayData.customerMobile}</span>
          </div>
          <div className="detail-item">
            <span className="label">Customer Email:</span> 
            <span className="value">{displayData.customerEmail}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handleGoHome}>
            Book Another Movie
          </button>
          <button className="btn btn-secondary" onClick={handleViewBookings}>
            View My Bookings
          </button>
        </div>

        <div className="note-section">
          <p className="note">
            📋 <strong>Important:</strong> All sales are final and there will be no refunds, cancellations and or
            amendments to the confirmed and finalized bookings.
          </p>
          <p className="confirmation-note">
            📧 A confirmation email has been sent to your registered email address with your ticket details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;