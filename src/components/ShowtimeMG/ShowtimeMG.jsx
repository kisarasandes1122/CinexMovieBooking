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
        showtime.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase())
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
    };

    const handleCloseForm = () => {
        setFormVisible(false);
        resetForm();
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
            alert("Please fill in all required fields.");
            return;
        }

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

        try {
            const response = await apiService.showtimes.create(newShowtime);
            const data = response.data;
            
            //Refresh the data from backend
            const response_details = await apiService.showtimes.getAllWithDetails();
            setShowtimes(response_details.data);
            alert("Showtime Added Successfully")

        }
        catch (error) {
            const errorMessage = handleApiError(error, 'Failed to create showtime');
            alert(errorMessage);
        }

        handleCloseForm();
    };

    const handleDelete = async (id) => {
      try {
           await apiService.showtimes.delete(id);
           
          //Refresh the data from backend
            const response_details = await apiService.showtimes.getAllWithDetails();
            setShowtimes(response_details.data);
          alert("Showtime Deleted Successfully")

        }
      catch (error) {
            const errorMessage = handleApiError(error, 'Failed to delete showtime');
            alert(errorMessage);
      }
    };

    if (loading) {
        return <div className="loading">Loading showtimes...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="showtime-content">
            <div className="app">
                <header className="showtime-management-header">
                    <h1>Showtime Management</h1>
                    <input
                        type="text"
                        placeholder="Search Movies"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="add-showtime-btn" onClick={handleAddShowtimeClick}>
                        Add Showtime
                    </button>
                </header>

                <table className="showtime-table">
                    <thead>
                    <tr>
                         <th>Movie</th>
                        <th>Theatre</th>
                        <th>Screen</th>
                        <th>Start Date</th>
                        <th>Recurrence Type</th>
                        <th>End Date</th>
                        <th>Time</th>
                        <th>Format</th>
                        <th>Seat Price</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredShowtimes.map((showtime) => (
                        <tr key={showtime._id}>
                            <td>{showtime.movieTitle}</td>
                            <td>{showtime.theatreLocation}</td>
                            <td>{showtime.screenNumber}</td>
                            <td>{showtime.startDate.split("T")[0]}</td>
                            <td>{showtime.recurrenceType}</td>
                             <td>{showtime.endDate ? showtime.endDate.split("T")[0] : ""}</td>
                            <td>{showtime.startTime}</td>
                            <td>{showtime.screenFormat}</td>
                            <td>{showtime.seatPrice}</td>
                            <td className="tablebtnrow">
                                <button onClick={() => handleDelete(showtime._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {isFormVisible && (
                    <div className="form-overlay">
                        <div className="form-container">
                            <h2>Add Showtime</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label>Movie</label>
                                    <select name="movie" value={formData.movie} onChange={handleFormChange}>
                                        <option value="">Select a movie</option>
                                        {movies.map((movie) => (
                                            <option key={movie._id} value={movie._id}>{movie.title}</option>
                                        ))}
                                    </select>
                                </div>
                                  <div className="form-group">
                                        <label>Theatre Location</label>
                                        <input
                                            type="text"
                                            name="theatreLocation"
                                            value={formData.theatreLocation}
                                            readOnly
                                        />
                                </div>
                                <div className="form-group">
                                    <label>Screen</label>
                                       <select name="screen" value={formData.screen} onChange={handleFormChange}>
                                           <option value="">Select a screen</option>
                                             {screens.map(screen => (
                                              <option key={screen._id} value={screen._id}> {screen.screenNumber}</option>
                                            ))}
                                        </select>
                                </div>
                                <div className="form-group inline-group">
                                    <div>
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Time</label>
                                        <select name="time" value={formData.time} onChange={handleFormChange}>
                                            {timeOptions.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Seat Price</label>
                                        <input
                                            type="text"
                                            name="seatPrice"
                                            placeholder="Enter seat price"
                                            value={formData.seatPrice}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group inline-group">
                                    <div>
                                        <label>Recurrence Type</label>
                                        <select
                                            name="recurrenceType"
                                            value={formData.recurrenceType}
                                            onChange={handleFormChange}
                                        >
                                            <option value="None">None</option>
                                            <option value="Daily">Daily</option>
                                        </select>
                                    </div>
                                    {formData.recurrenceType === "Daily" && (
                                        <div>
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleFormChange}
                                                min={formData.startDate}
                                            />
                                        </div>
                                    )}
                                </div>


                                <div className="form-actions">
                                    <button type="button" onClick={handleCloseForm}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-button">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShowtimeMG;