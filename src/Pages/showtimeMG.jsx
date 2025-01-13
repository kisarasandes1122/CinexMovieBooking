import React, { useState, useEffect } from 'react';
import 'src/Pages/showtimeMG.jsx';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios'; // Import axios or use fetch

const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your API URL

function ShowtimeMG() {
    const [showtimes, setShowtimes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddShowtimePopupOpen, setIsAddShowtimePopupOpen] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors


   useEffect(() => {
        const fetchShowtimes = async () => {
             setLoading(true);
            setError(null);
            try{
               const response = await axios.get(`${API_BASE_URL}/showtimes`); // Replace with your API endpoint

                if (response.status === 200) {
                  setShowtimes(response.data); // Assumes data is an array of showtimes
                } else {
                    throw new Error(`Failed to fetch showtimes: ${response.status}`);
                  }
            } catch(error){
              setError(error.message);
            } finally{
                 setLoading(false);
             }
          };
           fetchShowtimes();
        }, []);



    const filteredShowtimes = showtimes.filter((showtime) =>
        Object.values(showtime)
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleAddShowtimeClick = () => {
        setEditingShowtime(null);
        setIsAddShowtimePopupOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddShowtimePopupOpen(false);
        setEditingShowtime(null);
    };

   const handleDeleteShowtime = async (id) => {
        try{
            const response = await axios.delete(`${API_BASE_URL}/showtimes/${id}`);

              if(response.status === 200){
                  setShowtimes(showtimes.filter(showtime => showtime._id !== id));
              } else{
                 throw new Error(`Failed to delete showtime: ${response.status}`);
              }

          }
           catch (err) {
              setError(err.message);
            }
        };


    const handleEditShowtime = (showtime) => {
        setEditingShowtime(showtime);
        setIsAddShowtimePopupOpen(true);
    };


    const handleSaveShowtime = async (newShowtime) => {
     try {
            if (editingShowtime) {
                 const response = await axios.put(`${API_BASE_URL}/showtimes/${editingShowtime._id}`, newShowtime);
                 if (response.status === 200) {
                       //Update the list
                      setShowtimes(showtimes.map(showtime =>
                           showtime._id === editingShowtime._id ? response.data : showtime
                        ));
                 }else{
                      throw new Error(`Failed to update showtime: ${response.status}`);
                    }
            } else {

              const response = await axios.post(`${API_BASE_URL}/showtimes`, newShowtime);
              if (response.status === 201) {
                  setShowtimes([...showtimes, response.data]);
              } else {
                     throw new Error(`Failed to create showtime: ${response.status}`);
               }
            }
             handleCloseModal();
        } catch (err) {
            setError(err.message);
      }
  };


    if(loading){
        return <div>Loading showtimes....</div>
     }
     if(error){
        return <div>Error: {error}</div>
     }
    return (
        <div className="container">
            <div className="header">
                <h1>Showtime Management</h1>
                <button className="add-showtime-button" onClick={handleAddShowtimeClick}>
                    Add Showtime
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Movies or Theatre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table>
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
                        {filteredShowtimes.map((showtime) => (
                            <tr key={showtime._id}>
                                <td>{showtime.movieId?.title}</td>
                                <td>{showtime.theatreId}</td>
                                <td>{showtime.screenId}</td>
                                <td>{showtime.start_date}</td>
                                 <td>{showtime.end_date}</td>
                                <td>{showtime.start_time}</td>
                                <td>{showtime.format}</td>
                                <td>{showtime.seatPrice}</td>
                                <td className="action-icons">
                                    <button className="icon-button edit-button" onClick={() => handleEditShowtime(showtime)}>
                                        <FiEdit />
                                    </button>
                                    <button className="icon-button delete-button" onClick={() => handleDeleteShowtime(showtime._id)}>
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="pagination-button"></button>
                <span>Page 1 of 2</span>
                <button className="pagination-button"></button>
            </div>

            {isAddShowtimePopupOpen && (
                <AddShowtimePopup
                    onClose={handleCloseModal}
                    onSave={handleSaveShowtime}
                    editingShowtime={editingShowtime}
                />
            )}
        </div>
    );
}


// Modified `AddShowtimePopup` Component (API Integration)
function AddShowtimePopup({ onClose, onSave, editingShowtime }) {
    const [movie, setMovie] = useState(editingShowtime?.movieId || '');
    const [theatre, setTheatre] = useState(editingShowtime?.theatreId || '');
    const [screen, setScreen] = useState(editingShowtime?.screenId || '');
    const [startDate, setStartDate] = useState(editingShowtime?.start_date || '');
    const [selectedTime, setSelectedTime] = useState('');
    const [endDate, setEndDate] = useState(editingShowtime?.end_date || '');
     const [seatPrice, setSeatPrice] = useState(editingShowtime?.seatPrice || '');

    // Generate time options in 12-hour format with 30-minute intervals
   const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (const minute of ['00', '30']) {
                const period = hour < 12 ? 'AM' : 'PM'; // Changed to uppercase
                let displayHour = hour % 12;
                if (displayHour === 0) {
                    displayHour = 12;
                }
                times.push(`${displayHour}:${minute} ${period}`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    // Initialize selectedTime if editing
    React.useEffect(() => {
        if (editingShowtime && editingShowtime.start_time) {
            const [hour24, minute] = editingShowtime.start_time.split(':');
            const hour = parseInt(hour24, 10);
            const period = hour < 12 ? 'AM' : 'PM'; // Changed to uppercase
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            setSelectedTime(`${displayHour}:${minute} ${period}`);
        } else {
            setSelectedTime('12:00 AM'); // Default time with uppercase
        }
    }, [editingShowtime]);



   const handleSubmit = async () => {
        const [timePart, periodPart] = selectedTime.split(' ');
        const [displayHourStr, minute] = timePart.split(':');
        let displayHour = parseInt(displayHourStr, 10);
        let hour24 = displayHour;

         if (periodPart === 'PM' && displayHour !== 12) {
            hour24 += 12;
        } else if (periodPart === 'AM' && displayHour === 12) {
            hour24 = 0;
        } else if (periodPart === 'PM' && displayHour === 12) {
            hour24 = 12;
        }


     const newShowtime = {
            movieId: movie,
           theatreId: theatre,
           screenId: screen,
            start_date: startDate,
             end_date: endDate,
            start_time: `${String(hour24).padStart(2, '0')}:${minute}`,
           seatPrice: seatPrice,
            format: 'IMAX' // You can make format editable as well.
      };

        onSave(newShowtime);
    };


    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>{editingShowtime ? 'Edit Showtime' : 'Add Showtime'}</h2>
                <div className="form-group">
                    <label htmlFor="movie">Movie</label>
                    <select id="movie" value={movie} onChange={(e) => setMovie(e.target.value)}>
                        <option value="">Select a movie</option>
                        <option value="662d14d232b993c18950923f">Interstellar</option>
                        <option value="662d14e132b993c189509241">One shot One</option>
                        <option value="662d14f332b993c189509243">Ra Daniel Dawal Migel</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="theatre">Theatre</label>
                    <select id="theatre" value={theatre} onChange={(e) => setTheatre(e.target.value)}>
                        <option value="">Select a theatre</option>
                        <option value="662d153532b993c189509245">Cinex - OGF</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="screen">Screen</label>
                    <select id="screen" value={screen} onChange={(e) => setScreen(e.target.value)}>
                        <option value="">Select a screen</option>
                        <option value="662d154d32b993c189509247">01</option>
                        <option value="662d155632b993c189509249">02</option>
                        <option value="662d155f32b993c18950924b">03</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-group">
                   <label htmlFor="time">Time</label>
                    <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                        <option value="">Select Time</option>
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="end-date">End Date</label>
                    <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                 </div>
                 <div className="form-group">
                    <label htmlFor="seat-price">Seat Price</label>
                    <input
                        type="text"
                        id="seat-price"
                        value={seatPrice}
                        onChange={(e) => setSeatPrice(e.target.value)}
                    />
                </div>
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="save-button" onClick={handleSubmit}>
                        {editingShowtime ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}


export default ShowtimeMG;