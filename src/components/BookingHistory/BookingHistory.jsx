import React, { useState, useEffect } from 'react';
import './BookingHistory.css';
import { useNavigate } from 'react-router-dom';

function BookingHistoryP() {
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve userId from localStorage when the component mounts
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
      //Fetch booking data only if there is a userId
      if(userId){
          const fetchBookings = async () => {
              try {
                  const response = await fetch(`http://localhost:27017/api/bookings/user/${userId}`);
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  const data = await response.json();
                  setBookings(data);
              } catch (error) {
                  console.error('Failed to fetch bookings:', error);
                  // Handle the error (e.g., display an error message to the user)
              }
          };
           fetchBookings();
      }


  }, [userId]);


  const handleBookingClick = (bookingId) => {
    navigate(`/Booking?bookingId=${bookingId}`);
  };



    return (
        <div className="bkh-body">
            <div className="bkh-container">
                <div className="bkh-booking-history">
                    <h2 className="bkh-title">Movie Booking History</h2>
                    <div className="bkh-title-line"></div>
                    <div className="bkh-bookings-list">
                        {bookings.map((booking) => (
                             <div
                                key={booking._id}
                                className="bkh-booking-card"
                                onClick={() => handleBookingClick(booking._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div>
                                    <div className="bkh-movie-title">{booking.showtimeId?.movieId?.title}</div>
                                    <div className="bkh-cinema">{booking.showtimeId?.screenId?.screenNumber}</div>
                                    <div className="bkh-date">
                                        {new Date(booking.booking_date).toLocaleString()}
                                    </div>
                                </div>
                                <div className="bkh-arrow"></div>
                            </div>
                        ))}
                        {bookings.length === 0 &&  (
                            <p> No Bookings found for this user </p>
                        )}
                         {userId === null && (
                            <p>User ID not found.</p>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingHistoryP;