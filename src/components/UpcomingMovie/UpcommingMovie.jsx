import React from 'react';
import './UpcommingMovie.css';

function UpCommingMovie() {
    return (
      <div className="container-upcoming">
          <div className="upcoming-movie">
              <h2 className="title">Upcoming Movie Bookings</h2>
              <div className="title-line"></div>
              <div className="bookings-list">
                  <div className="booking-card">
                      <div>
                          <div className="movie-title">Spider-Man: Far from Home</div>
                          <div className="cinema">CINEX - Bambalapitiya</div>
                          <div className="date">Fri, 27 Jan</div>
                      </div>
                      <div className="arrow"></div>
                  </div>
                  <div className="booking-card">
                      <div>
                          <div className="movie-title">Spider-Man: Far from Home</div>
                          <div className="cinema">CINEX - Bambalapitiya</div>
                          <div className="date">Fri, 27 Jan</div>
                      </div>
                      <div className="arrow"></div>
                  </div>
                  <div className="booking-card">
                      <div>
                          <div className="movie-title">Spider-Man: Far from Home</div>
                          <div className="cinema">CINEX - Bambalapitiya</div>
                          <div className="date">Fri, 27 Jan</div>
                      </div>
                      <div className="arrow"></div>
                  </div>
              </div>
          </div>
      </div>
    );
}

export default UpCommingMovie;
