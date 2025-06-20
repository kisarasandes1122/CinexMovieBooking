import React from 'react';
import './Showtime.css';

const Showtime = () => {
  return (
    <div className="showtimemain">
      <div className="showtime-breadcrumb">
        <div className="breadcrumb-container">
          <span className="breadcrumb-item">
            <span className="breadcrumb-icon">🏠</span>
            Home
          </span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-item active">
            <span className="breadcrumb-icon">🎟️</span>
            Buy Ticket
          </span>
        </div>
      </div>
    </div>
  );
};

export default Showtime;