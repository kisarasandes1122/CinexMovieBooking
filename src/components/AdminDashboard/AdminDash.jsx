import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDash.css';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

const AdminDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeShowtimes, setActiveShowtimes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch Total Movies
                const moviesResponse = await apiService.movies.getCount();
                setTotalMovies(moviesResponse.data.count);

                // Fetch Total Users
                const usersResponse = await apiService.auth.getUserCount();
                setTotalUsers(usersResponse.data.count);

                // Fetch Active Showtimes
                const showtimesResponse = await apiService.showtimes.getTodayCount();
                setActiveShowtimes(showtimesResponse.data.count);

            } catch (err) {
                const errorMessage = handleApiError(err);
                setError(errorMessage);
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading....</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }


  return (
    <div className="dashboard">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => handleNavigation('/dashboard')}>Dashboard</li>
          <li onClick={() => handleNavigation('/manage-movies')}>Manage Movies</li>
          <li onClick={() => handleNavigation('/manage-showtimes')}>Manage Showtimes</li>
          <li onClick={() => handleNavigation('/settings')}>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <header>
          <button className="toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
        </header>
        <div className="admincontent">
          <main>
            {/* Quick Insight Section */}
            <div className="quick-insight-container">
              <section className="section">
                <h2 className="section-title">Quick Insight</h2>
                <div className="stats-grid">
                    <Card title="Total Movies" value={totalMovies} />
                    <Card title="Active Showtimes" value={activeShowtimes} />
                    <Card title="Total Users" value={totalUsers} />
                </div>
              </section>
            </div>

            {/* Quick Links Section */}
            <div className="quick-links-container">
              <section className="section">
                <h2 className="section-title">Quick Links</h2>
                <div className="actions-grid">
                  <Button
                    label="Add Showtime"
                    onClick={() => handleNavigation('/showtimeMG')}
                  />
                  <Button
                    label="Add Movies"
                    onClick={() => handleNavigation('/MMHeader')}
                  />
                  <Button
                    label="Add Theatre"
                    onClick={() => handleNavigation('/TheatreManage')}
                  />
                </div>
              </section>
            </div>
          </main>
        </div>
        
      </div>
    </div>
  );
};

/* Reusable Card Component */
const Card = ({ title, value }) => (
  <div className="card">
    <h3 className="card-title">{title}</h3>
    <p className="card-value">{value}</p>
  </div>
);

/* Reusable Button Component */
const Button = ({ label, onClick }) => (
  <button className="action-button" onClick={onClick}>
    {label} <span>➔</span>
  </button>
);

export default AdminDash;