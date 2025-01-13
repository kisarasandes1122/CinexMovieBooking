import React, { useState } from 'react';
import '../ShowtimeMG/ShowtimeMG';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const initialShowtimes = [
    {
        id: 1,
        movie: 'Interstellar',
        theatre: 'Cinex - OGF',
        screen: '03',
        startDate: '2024/03/15',
        endDate: '2024/03/15',
        time: '19:00',
        format: 'IMAX',
        seatPrice: 'Rs. 2500',
    },
];

function ShowtimeMG() {
    const [showtimes, setShowtimes] = useState(initialShowtimes);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddShowtimePopupOpen, setIsAddShowtimePopupOpen] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);

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

    const handleDeleteShowtime = (id) => {
        const updatedShowtimes = showtimes.filter((showtime) => showtime.id !== id);
        setShowtimes(updatedShowtimes);
    };

    const handleEditShowtime = (showtime) => {
        setEditingShowtime(showtime);
        setIsAddShowtimePopupOpen(true);
    };

    const handleSaveShowtime = (newShowtime) => {
        if (editingShowtime) {
            const updatedShowtimes = showtimes.map((showtime) =>
                showtime.id === editingShowtime.id ? newShowtime : showtime
            );
            setShowtimes(updatedShowtimes);
        } else {
            newShowtime.id = showtimes.length > 0 ? showtimes[showtimes.length - 1].id + 1 : 1;
            setShowtimes([...showtimes, newShowtime]);
        }
        handleCloseModal();
    };

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
                            <tr key={showtime.id}>
                                <td>{showtime.movie}</td>
                                <td>{showtime.theatre}</td>
                                <td>{showtime.screen}</td>
                                <td>{showtime.startDate}</td>
                                <td>{showtime.endDate}</td>
                                <td>{showtime.time}</td>
                                <td>{showtime.format}</td>
                                <td>{showtime.seatPrice}</td>
                                <td className="action-icons">
                                    <button className="icon-button edit-button" onClick={() => handleEditShowtime(showtime)}>
                                        <FiEdit />
                                    </button>
                                    <button className="icon-button delete-button" onClick={() => handleDeleteShowtime(showtime.id)}>
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

function AddShowtimePopup({ onClose, onSave, editingShowtime }) {
    const [movie, setMovie] = useState(editingShowtime?.movie || '');
    const [theatre, setTheatre] = useState(editingShowtime?.theatre || '');
    const [screen, setScreen] = useState(editingShowtime?.screen || '');
    const [startDate, setStartDate] = useState(editingShowtime?.startDate || '');
    const [selectedTime, setSelectedTime] = useState('');
    const [endDate, setEndDate] = useState(editingShowtime?.endDate || '');
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
        if (editingShowtime && editingShowtime.time) {
            const [hour24, minute] = editingShowtime.time.split(':');
            const hour = parseInt(hour24, 10);
            const period = hour < 12 ? 'AM' : 'PM'; // Changed to uppercase
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            setSelectedTime(`${displayHour}:${minute} ${period}`);
        } else {
            setSelectedTime('12:00 AM'); // Default time with uppercase
        }
    }, [editingShowtime]);

    const handleSubmit = () => {
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
            id: editingShowtime?.id,
            movie,
            theatre,
            screen,
            startDate,
            endDate,
            time: `${String(hour24).padStart(2, '0')}:${minute}`,
            format: 'IMAX',
            seatPrice,
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
                        <option value="Interstellar">Interstellar</option>
                        <option value="One shot One">One shot One</option>
                        <option value="Ra Daniel Dawal Migel">Ra Daniel Dawal Migel</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="theatre">Theatre</label>
                    <select id="theatre" value={theatre} onChange={(e) => setTheatre(e.target.value)}>
                        <option value="">Select a theatre</option>
                        <option value="Cinex - OGF">Cinex - OGF</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="screen">Screen</label>
                    <select id="screen" value={screen} onChange={(e) => setScreen(e.target.value)}>
                        <option value="">Select a screen</option>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
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