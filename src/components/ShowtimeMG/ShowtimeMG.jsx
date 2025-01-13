import React, { useState } from "react";
import "./ShowtimeMG.css";

function ShowtimeMG() {
  const [showtimes, setShowtimes] = useState([
    {
      movie: "Interstellar",
      theatre: "Cinex - OGF",
      screen: "03",
      startDate: "2024/03/15",
      endDate: "2024/03/15",
      time: "19:00",
      format: "IMAX",
      seatPrice: "Rs. 2500",
    },
  ]);

  const [isFormVisible, setFormVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    movie: "",
    theatre: "",
    screen: "",
    startDate: "",
    endDate: "",
    time: "",
    seatPrice: "",
    format: "IMAX",
  });

  // Open form for adding a new showtime
  const handleAddShowtimeClick = () => {
    setFormVisible(true);
    setEditMode(false); // Not in edit mode
    resetForm();
  };

  // Open form for editing an existing showtime
  const handleEditClick = (index) => {
    setFormVisible(true);
    setEditMode(true); // Set to edit mode
    setCurrentEditIndex(index);
    setFormData(showtimes[index]);
  };

  // Close the form
  const handleCloseForm = () => {
    setFormVisible(false);
    resetForm();
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      movie: "",
      theatre: "",
      screen: "",
      startDate: "",
      endDate: "",
      time: "",
      seatPrice: "",
      format: "IMAX",
    });
    setCurrentEditIndex(null);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form for adding or editing
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.movie || !formData.theatre || !formData.seatPrice) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isEditMode) {
      // Update the showtime in the list
      const updatedShowtimes = [...showtimes];
      updatedShowtimes[currentEditIndex] = formData;
      setShowtimes(updatedShowtimes);
    } else {
      // Add a new showtime
      setShowtimes([...showtimes, formData]);
    }

    handleCloseForm();
  };

  // Delete a showtime
  const handleDelete = (index) => {
    const updatedShowtimes = showtimes.filter((_, i) => i !== index);
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
                <th>End Date</th>
                <th>Time</th>
                <th>Format</th>
                <th>Seat Price</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {showtimes.map((showtime, index) => (
                <tr key={index}>
                <td>{showtime.movie}</td>
                <td>{showtime.theatre}</td>
                <td>{showtime.screen}</td>
                <td>{showtime.startDate}</td>
                <td>{showtime.endDate}</td>
                <td>{showtime.time}</td>
                <td>{showtime.format}</td>
                <td>{showtime.seatPrice}</td>
                <td className="tablebtnrow">
                    <button onClick={() => handleEditClick(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                    </button>
                    <button onClick={() => handleDelete(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
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
                <h2>{isEditMode ? "Edit Showtime" : "Add Showtime"}</h2>
                <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Movie</label>
                    <input
                    type="text"
                    name="movie"
                    placeholder="Enter movie name"
                    value={formData.movie}
                    onChange={handleFormChange}
                    />
                </div>
                <div className="form-group">
                    <label>Theatre</label>
                    <input
                    type="text"
                    name="theatre"
                    placeholder="Enter theatre name"
                    value={formData.theatre}
                    onChange={handleFormChange}
                    />
                </div>
                <div className="form-group">
                    <label>Screen</label>
                    <input
                    type="text"
                    name="screen"
                    placeholder="Enter screen number"
                    value={formData.screen}
                    onChange={handleFormChange}
                    />
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
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleFormChange}
                    />
                    </div>
                    <div>
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                    />
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
                <div className="form-actions">
                    <button type="button" onClick={handleCloseForm}>
                    Cancel
                    </button>
                    <button type="submit">
                    {isEditMode ? "Save Changes" : "Save"}
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
