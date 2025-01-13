import React, { useState } from "react";
import "./ShowtimeMG.css";

function ShowtimeMG() {
  const [showtimes, setShowtimes] = useState([
    {
      id: 1,
      movie: "Interstellar",
      theatre: "Cinex - OGF",
      screen: "01",
      startDate: "2024-07-20",
      time: "10:00",
      format: "IMAX",
      seatPrice: "2000",
      recurrenceType: "None",
      endDate: "",
    },
    {
      id: 2,
      movie: "One shot One",
      theatre: "Cinex - OGF",
      screen: "02",
      startDate: "2024-07-21",
      time: "14:30",
      format: "IMAX",
      seatPrice: "2500",
      recurrenceType: "Daily",
      endDate: "2024-07-26",
    },
    {
      id: 3,
      movie: "Ra Daniel Dawal Migel",
      theatre: "Cinex - OGF",
      screen: "03",
      startDate: "2024-07-22",
      time: "20:00",
      format: "IMAX",
      seatPrice: "1800",
      recurrenceType: "None",
      endDate: "",
    },
  ]);

  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    movie: "",
    theatre: "",
    screen: "",
    startDate: "",
    endDate: "",
    time: "12:00 AM",
    seatPrice: "",
    format: "IMAX",
    recurrenceType: "None",
  });

  // Filter showtimes based on search
  const filteredShowtimes = showtimes.filter((showtime) =>
    Object.values(showtime)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
      theatre: "",
      screen: "",
      startDate: "",
      endDate: "",
      time: "12:00 AM",
      seatPrice: "",
      format: "IMAX",
      recurrenceType: "None",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.movie || !formData.theatre || !formData.seatPrice) {
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

    const newShowtime = {
      ...formData,
      id: Date.now(),
      time: time24,
    };

    setShowtimes([...showtimes, newShowtime]);
    handleCloseForm();
  };

  const handleDelete = (id) => {
    const updatedShowtimes = showtimes.filter((showtime) => showtime.id !== id);
    setShowtimes(updatedShowtimes);
  };

  return (
    <div className="showtime-content">
      <div className="app">
        <header className="showtime-management-header">
          <h1>Showtime Management</h1>
          <input
            type="text"
            placeholder="Search Movies or Theatre"
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
              <tr key={showtime.id}>
                <td>{showtime.movie}</td>
                <td>{showtime.theatre}</td>
                <td>{showtime.screen}</td>
                <td>{showtime.startDate}</td>
                <td>{showtime.recurrenceType}</td>
                <td>{showtime.endDate}</td>
                <td>{showtime.time}</td>
                <td>{showtime.format}</td>
                <td>{showtime.seatPrice}</td>
                <td className="tablebtnrow">
                  <button onClick={() => handleDelete(showtime.id)}>
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
                    <option value="Interstellar">Interstellar</option>
                    <option value="One shot One">One shot One</option>
                    <option value="Ra Daniel Dawal Migel">Ra Daniel Dawal Migel</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Theatre</label>
                  <select name="theatre" value={formData.theatre} onChange={handleFormChange}>
                    <option value="">Select a theatre</option>
                    <option value="Cinex - OGF">Cinex - OGF</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Screen</label>
                  <select name="screen" value={formData.screen} onChange={handleFormChange}>
                    <option value="">Select a screen</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
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