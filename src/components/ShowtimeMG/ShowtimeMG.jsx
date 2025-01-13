import React, { useState, useEffect } from "react";
import "./ShowtimeMG.css";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:27017/api'; // Replace with your API URL

function ShowtimeMG() {
    const [showtimes, setShowtimes] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        movie: "",
        theatre: "",
        screen: "",
        startDate: "",
        endDate: "",
        time: "",
        seatPrice: "",
        format: "",
         recurrenceType: "",
         recurrenceEndDate: ""
    });

    useEffect(() => {
          const fetchShowtimes = async () => {
              setLoading(true);
              setError(null);
              try{
                  const response = await axios.get(`${API_BASE_URL}/showtimes`);

                    if (response.status === 200) {
                        setShowtimes(response.data);
                    } else {
                         throw new Error(`Failed to fetch showtimes: ${response.status}`);
                    }

                }
              catch(error){
                  setError(error.message)
              }
              finally{
                   setLoading(false);
               }
           }
           fetchShowtimes();
        }, []);

    // Filtered showtimes based on search input
    const filteredShowtimes = showtimes.filter((showtime) =>
        Object.values(showtime)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    // Open form for adding a new showtime
    const handleAddShowtimeClick = () => {
        setFormVisible(true);
        setEditMode(false);
        resetForm();
    };

    // Open form for editing an existing showtime
    const handleEditClick = (index) => {
      setFormVisible(true);
      setEditMode(true);
       setCurrentEditIndex(index);
       const editShowtime = showtimes[index];
       setFormData({
          movie: editShowtime.movieId?._id || '',
          theatre: editShowtime.theatreId || '',
           screen: editShowtime.screenId || '',
           startDate: editShowtime.start_date.split('T')[0] || '',
          endDate: editShowtime.end_date.split('T')[0] || '',
          time: editShowtime.start_time || '',
          seatPrice: editShowtime.seatPrice || '',
          format: "IMAX",
          recurrenceType: editShowtime.recurrence?.type || '',
          recurrenceEndDate: editShowtime.recurrence?.endDate?.split('T')[0] || ''
        });
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
            recurrenceType: "",
            recurrenceEndDate: ""
        });
        setCurrentEditIndex(null);
    };

    // Handle form input changes
     const handleFormChange = (e) => {
        const { name, value } = e.target;
         setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.movie || !formData.screen || !formData.seatPrice || !formData.startDate || !formData.endDate || !formData.time) {
         alert("Please fill in all required fields.");
        return;
       }
       try{
             const startDate = new Date(formData.startDate).toISOString().split('T')[0];
             const endDate = new Date(formData.endDate).toISOString().split('T')[0];
              const newShowtime = {
                   movieId: formData.movie,
                   screenId: formData.screen,
                  start_date: startDate,
                  start_time: formData.time,
                  end_date: endDate,
                   seatPrice: formData.seatPrice,

                 }
                 if (formData.recurrenceType) {
                     newShowtime.recurrence = {
                         type: formData.recurrenceType,
                       endDate: formData.recurrenceEndDate ? new Date(formData.recurrenceEndDate).toISOString().split('T')[0] : undefined
                   }
                   }
        if (isEditMode) {
                const response = await axios.put(`${API_BASE_URL}/showtimes/${showtimes[currentEditIndex]._id}`, newShowtime);

               if(response.status === 200){
                  // Update the showtime in the list
                   const updatedShowtimes = [...showtimes];
                    updatedShowtimes[currentEditIndex] = response.data;
                   setShowtimes(updatedShowtimes);
                 }
                 else{
                   throw new Error(`Failed to edit the showtime: ${response.status}`);
               }
            } else {
             const response = await axios.post(`${API_BASE_URL}/showtimes`, newShowtime);
               if(response.status === 201){
                // Add a new showtime
                    setShowtimes([...showtimes, response.data]);
                } else {
                 throw new Error(`Failed to add the showtime: ${response.status}`);
               }
            }
         handleCloseForm();
        }
      catch(error){
         setError(error.message);
      }
    };
    // Delete a showtime
   const handleDelete = async (index) => {
        try{
             const response = await axios.delete(`${API_BASE_URL}/showtimes/${showtimes[index]._id}`);

            if(response.status === 200){
              const updatedShowtimes = showtimes.filter((_, i) => i !== index);
                 setShowtimes(updatedShowtimes);
            }
            else {
                  throw new Error(`Failed to delete showtime: ${response.status}`);
            }
          }
         catch(error){
             setError(error.message)
         }
    };
   if(loading){
      return <div>Loading Showtimes....</div>
   }
   if(error){
        return <div>Error: {error}</div>
    }
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
                             <th>End Date</th>
                            <th>Time</th>
                            <th>Format</th>
                            <th>Seat Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShowtimes.map((showtime, index) => (
                            <tr key={showtime._id}>
                                <td>{showtime.movieId?.title}</td>
                                <td>{showtime.theatreId}</td>
                                <td>{showtime.screenId}</td>
                                <td>{showtime.start_date.split('T')[0]}</td>
                                 <td>{showtime.end_date.split('T')[0]}</td>
                                <td>{showtime.start_time}</td>
                                <td>{showtime.format}</td>
                                <td>{showtime.seatPrice}</td>
                                <td className="tablebtnrow">
                                    <button onClick={() => handleEditClick(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDelete(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
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
                                    <select name="movie" value={formData.movie} onChange={handleFormChange}>
                                        <option value="">Select a Movie</option>
                                          <option value="662d14d232b993c18950923f">Interstellar</option>
                                          <option value="662d14e132b993c189509241">One shot One</option>
                                         <option value="662d14f332b993c189509243">Ra Daniel Dawal Migel</option>
                                     </select>
                                </div>
                                <div className="form-group">
                                    <label>Theatre</label>
                                    <select  name="theatre" value={formData.theatre} onChange={handleFormChange} disabled={true}>
                                        <option value="">Select a Theatre</option>
                                        <option value="662d153532b993c189509245">Cinex - OGF</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                   <label>Screen</label>
                                    <select  name="screen" value={formData.screen} onChange={handleFormChange}>
                                        <option value="">Select a Screen</option>
                                       <option value="662d154d32b993c189509247">01</option>
                                         <option value="662d155632b993c189509249">02</option>
                                        <option value="662d155f32b993c18950924b">03</option>
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
                                     <div>
                                       <label>Recurrence Type</label>
                                        <select name="recurrenceType" value={formData.recurrenceType} onChange={handleFormChange}>
                                            <option value="">None</option>
                                             <option value="daily">Daily</option>
                                         </select>
                                     </div>
                                    {formData.recurrenceType === 'daily' && (
                                        <div>
                                            <label>Recurrence End Date</label>
                                             <input
                                                type="date"
                                                  name="recurrenceEndDate"
                                               value={formData.recurrenceEndDate}
                                                 onChange={handleFormChange}
                                             />
                                        </div>
                                    )}
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