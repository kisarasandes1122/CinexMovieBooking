import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";

const Navbar = ({ isLoggedIn }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-text">CINEX</span>
          </div>

          <div className="nav-links">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/Moviepage">Movies</NavLink>
            <NavLink href="/OffersPage">Offers & Promotions</NavLink>
            <NavLink href="/Contactus">About Us</NavLink>
          </div>

          {isLoggedIn ? (
            <div className="profile-section">
              <div className="profile-circle" onClick={toggleDropdown}></div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <p>Kisara Sandes</p>
                  <Link to="/edit-profile">Edit Profile</Link>
                  <Link to="/UpComingBooking">Upcoming Movie Bookings</Link>
                  <Link to="/booking-history">Movie Booking History</Link>
                  <Link to="/ChangePasswordForm">Change Password</Link>
                  <Link to="/logout">Log Out</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/SignInForm">
                <button className="login-button">SIGNIN</button>
              </Link>
              <Link to="/RegistrationForm">
                <button className="signup-button">SIGN UP</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link to={href} className={`nav-link ${isActive ? "active" : ""}`}>
      {children}
    </Link>
  );
};

export default Navbar;
