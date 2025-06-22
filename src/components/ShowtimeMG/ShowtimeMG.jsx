import React, { useState, useEffect } from "react";
import "./ShowtimeMG.css";
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

function ShowtimeMG() {
    const [showtimes, setShowtimes] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [movies, setMovies] = useState([]);
    const [screens, setScreens] = useState([]);
    const [theatres, setTheatres] = useState([]);

    const [formData, setFormData] = useState({
        movie: "",
        screen: "",
        startDate: "",
        endDate: "",
        time: "12:00 AM",
        seatPrice: "",
        format: "",
        recurrenceType: "None",
        theatreLocation: "",
    });

    useEffect(() => {
          const fetchData = async () => {
              setLoading(true);
              setError(null);
           try{
               const [showtimeResponse, movieResponse, screenResponse, theatreResponse] = await Promise.all([
                      apiService.showtimes.getAllWithDetails(),
                      apiService.movies.getAll(),
                      apiService.screens.getAll(),
                      apiService.theatres.getWithScreens()
                   ]);
                 
                 setShowtimes(showtimeResponse.data);
                 setMovies(movieResponse.data);
                 setScreens(screenResponse.data);
                 setTheatres(theatreResponse.data);
           }
           catch (err){
               const errorMessage = handleApiError(err, 'Failed to fetch data');
               setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

  // Filter showtimes based on search
     const filteredShowtimes = showtimes.filter((showtime) =>
        showtime.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.theatreLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate time options in 12-hour format
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (const minute of ["00", "30"]) {
                const period = hour < 12 ? "AM" : "PM";
                let displayHour = hour % 12;
                if (displayHour === 0) displayHour = 12;
                times.push(`${displayHour}:${minute} ${period}`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const handleAddShowtimeClick = () => {
        setFormVisible(true);
        resetForm();
        setError(null);
    };

    const handleCloseForm = () => {
        setFormVisible(false);
        resetForm();
        setError(null);
    };

     const resetForm = () => {
        setFormData({
            movie: "",
            screen: "",
            startDate: "",
            endDate: "",
            time: "12:00 AM",
            seatPrice: "",
            format: "",
            recurrenceType: "None",
            theatreLocation: "",
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
         setFormData(prevState => {
            if (name === 'screen') {
                 const selectedScreen = screens.find(screen => screen._id === value);
                return{...prevState, [name]: value, theatreLocation: selectedScreen ? selectedScreen.theatreId.location : ""};
            }
          return  { ...prevState, [name]: value };
        });
    };

      const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.movie || !formData.seatPrice || !formData.screen) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Convert 12h time to 24h format
            const [timePart, periodPart] = formData.time.split(" ");
            const [displayHourStr, minute] = timePart.split(":");
            let displayHour = parseInt(displayHourStr, 10);
            let hour24 = displayHour;

            if (periodPart === "PM" && displayHour !== 12) {
                hour24 += 12;
            } else if (periodPart === "AM" && displayHour === 12) {
                hour24 = 0;
            }

            const time24 = `${String(hour24).padStart(2, "0")}:${minute}`;

            const recurrence = formData.recurrenceType === "Daily" ? { type: "daily", endDate: formData.endDate } : { type: "none"}
            const newShowtime = {
                movieId: formData.movie,
                screenId: formData.screen,
                start_date: formData.startDate,
                start_time: time24,
                seatPrice: parseFloat(formData.seatPrice),
                recurrence: recurrence
            };

            const response = await apiService.showtimes.create(newShowtime);
            
            //Refresh the data from backend
            const response_details = await apiService.showtimes.getAllWithDetails();
            setShowtimes(response_details.data);
            
            handleCloseForm();
        }
        catch (error) {
            const errorMessage = handleApiError(error, 'Failed to create showtime');
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this showtime?')) {
          return;
      }
      
      try {
           await apiService.showtimes.delete(id);
           
          //Refresh the data from backend
            const response_details = await apiService.showtimes.getAllWithDetails();
            setShowtimes(response_details.data);

        }
      catch (error) {
            const errorMessage = handleApiError(error, 'Failed to delete showtime');
            setError(errorMessage);
      }
    };

    if (loading) {
        return (
            <div className="stm-loading-container">
                <div className="stm-loading-spinner"></div>
                <p>Loading showtimes...</p>
            </div>
        );
    }

    if (error && !isFormVisible) {
        return (
            <div className="stm-error-container">
                <div className="stm-error-icon">⚠️</div>
                <h2>Error Loading Data</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="stm-retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="stm-container">
            <div className="stm-header">
                <div className="stm-header-content">
                    <h1>Showtime Management</h1>
                    <p>Schedule and manage movie showtimes</p>
                </div>
                <button className="stm-add-btn" onClick={handleAddShowtimeClick}>
                    <span className="stm-btn-icon">⏰</span>
                    Add Showtime
                </button>
            </div>

            <div className="stm-search-container">
                <div className="stm-search-wrapper">
                    <span className="stm-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by movie or theatre..."
                        className="stm-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="stm-content">
                <div className="stm-table-header">
                    <h2>Scheduled Showtimes ({filteredShowtimes.length})</h2>
                </div>

                {filteredShowtimes.length === 0 ? (
                    <div className="stm-empty-state">
                        <div className="stm-empty-icon">🎭</div>
                        <h3>No Showtimes Found</h3>
                        <p>{searchTerm ? 'No showtimes match your search criteria' : 'Start by scheduling your first showtime'}</p>
                    </div>
                ) : (
                    <div className="stm-table-container">
                        <table className="stm-table">
                            <thead>
                                <tr>
                                    <th>Movie</th>
                                    <th>Theatre</th>
                                    <th>Screen</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Recurrence</th>
                                    <th>End Date</th>
                                    <th>Format</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShowtimes.map((showtime) => (
                                    <tr key={showtime._id}>
                                        <td className="stm-movie-cell">
                                            <div className="stm-movie-info">
                                                <span className="stm-movie-title">{showtime.movieTitle}</span>
                                            </div>
                                        </td>
                                        <td>{showtime.theatreLocation}</td>
                                        <td>
                                            <span className="stm-screen-badge">
                                                Screen {showtime.screenNumber}
                                            </span>
                                        </td>
                                        <td>{new Date(showtime.startDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className="stm-time-badge">{showtime.startTime}</span>
                                        </td>
                                        <td>
                                            <span className={`stm-recurrence-badge ${showtime.recurrenceType?.toLowerCase()}`}>
                                                {showtime.recurrenceType || 'None'}
                                            </span>
                                        </td>
                                        <td>{showtime.endDate ? new Date(showtime.endDate).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <span className="stm-format-badge">{showtime.screenFormat}</span>
                                        </td>
                                        <td>
                                            <span className="stm-price-badge">LKR {showtime.seatPrice}</span>
                                        </td>
                                        <td>
                                            <button 
                                                className="stm-delete-btn"
                                                onClick={() => handleDelete(showtime._id)}
                                                title="Delete showtime"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isFormVisible && (
                <div className="stm-modal-overlay">
                    <div className="stm-modal-content">
                        <div className="stm-modal-header">
                            <h2>Add New Showtime</h2>
                            <button className="stm-modal-close" onClick={handleCloseForm}>×</button>
                        </div>

                        {error && (
                            <div className="stm-error-message">
                                <span className="stm-error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="stm-form">
                            <div className="stm-form-row">
                                <div className="stm-form-group">
                                    <label className="stm-label">Movie *</label>
                                    <select 
                                        name="movie" 
                                        value={formData.movie} 
                                        onChange={handleFormChange}
                                        className="stm-select"
                                        required
                                    >
                                        <option value="">Select a movie</option>
                                        {movies.map((movie) => (
                                            <option key={movie._id} value={movie._id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="stm-form-group">
                                    <label className="stm-label">Screen *</label>
                                    <select 
                                        name="screen" 
                                        value={formData.screen} 
                                        onChange={handleFormChange}
                                        className="stm-select"
                                        required
                                    >
                                        <option value="">Select a screen</option>
                                        {screens.map(screen => (
                                            <option key={screen._id} value={screen._id}>
                                                Screen {screen.screenNumber} - {screen.theatreId?.location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="stm-form-group">
                                <label className="stm-label">Theatre Location</label>
                                <input
                                    type="text"
                                    name="theatreLocation"
                                    value={formData.theatreLocation}
                                    className="stm-input"
                                    readOnly
                                    placeholder="Auto-filled when screen is selected"
                                />
                            </div>

                            <div className="stm-form-row">
                                <div className="stm-form-group">
                                    <label className="stm-label">Start Date *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleFormChange}
                                        className="stm-input"
                                        required
                                    />
                                </div>

                                <div className="stm-form-group">
                                    <label className="stm-label">Time *</label>
                                    <select 
                                        name="time" 
                                        value={formData.time} 
                                        onChange={handleFormChange}
                                        className="stm-select"
                                        required
                                    >
                                        {timeOptions.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="stm-form-group">
                                    <label className="stm-label">Seat Price (LKR) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="seatPrice"
                                        placeholder="Enter seat price in LKR"
                                        value={formData.seatPrice}
                                        onChange={handleFormChange}
                                        className="stm-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="stm-form-row">
                                <div className="stm-form-group">
                                    <label className="stm-label">Recurrence Type</label>
                                    <select
                                        name="recurrenceType"
                                        value={formData.recurrenceType}
                                        onChange={handleFormChange}
                                        className="stm-select"
                                    >
                                        <option value="None">None</option>
                                        <option value="Daily">Daily</option>
                                    </select>
                                </div>

                                {formData.recurrenceType === "Daily" && (
                                    <div className="stm-form-group">
                                        <label className="stm-label">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleFormChange}
                                            min={formData.startDate}
                                            className="stm-input"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="stm-form-actions">
                                <button 
                                    type="button" 
                                    onClick={handleCloseForm}
                                    className="stm-cancel-btn"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="stm-save-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="stm-spinner"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <span className="stm-btn-icon">💾</span>
                                            Save Showtime
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowtimeMG;