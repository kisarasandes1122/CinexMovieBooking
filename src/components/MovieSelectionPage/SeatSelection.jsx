import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SeatSelection.css";
import { format } from 'date-fns';

const SeatSelection = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showtime, setShowtime] = useState(null);
    const [theatreLocation, setTheatreLocation] = useState("");
    const [screenFormat, setScreenFormat] = useState("");

    const navigate = useNavigate();

    // Get URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const showtimeId = queryParams.get("showtimeId");
    const movieTitle = queryParams.get("movieTitle");

    const API_BASE_URL = 'http://localhost:27017/api';
    const userId = localStorage.getItem('userId');


    useEffect(() => {
        const fetchSeatAndShowtimeData = async () => {
            try {
                setLoading(true);

                // Fetch Showtime data
                const showtimeResponse = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}`);
                if (!showtimeResponse.ok) {
                    throw new Error(`HTTP error! status: ${showtimeResponse.status} fetching showtime`);
                }
                const showtimeData = await showtimeResponse.json();
                setShowtime(showtimeData);

                // Log showtimeData.screenId here
                console.log("showtimeData.screenId:", showtimeData.screenId);

                const screenId = showtimeData.screenId._id; // Access the _id property

                console.log("screenId", screenId);

                 const screenResponse = await fetch(`${API_BASE_URL}/screens/${screenId}`);
                if (!screenResponse.ok) {
                    throw new Error(`HTTP error! status: ${screenResponse.status} fetching screen`);
                }
                const screenData = await screenResponse.json();
                setScreenFormat(screenData.format || "Standard");

                const theatreResponse = await fetch(`${API_BASE_URL}/theatres/${screenData.theatreId}`);
                if (!theatreResponse.ok) {
                    throw new Error(`HTTP error! status: ${theatreResponse.status} fetching theatre`);
                }
                const theatreData = await theatreResponse.json();
                setTheatreLocation(theatreData.location);


                const response = await fetch(`${API_BASE_URL}/showtimes/${showtimeId}/seats`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} fetching seats`);
                }
                const data = await response.json();

                // Group seats by row
                const groupedSeats = data.reduce((acc, seat) => {
                    const row = seat.seatNumber.charAt(0);
                    if (!acc[row]) {
                        acc[row] = [];
                    }
                    acc[row].push({
                        id: seat._id,
                        number: seat.seatNumber,
                        status: seat.status
                    });
                    return acc;
                }, {});

                setSeats(groupedSeats);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (showtimeId) {
            fetchSeatAndShowtimeData();
        }
    }, [showtimeId]);

    const rows = Object.keys(seats).sort().reverse();

    const handleSeatClick = (seatId, seatNumber, status) => {
        if (status === 'booked') return;


         setSelectedSeats((prev) => {
            const seatIndex = prev.findIndex(s => s.id === seatId);

            if(seatIndex > -1){
                return prev.filter((_,index) => index !== seatIndex)
            }
           
             return [...prev, { id: seatId, number: seatNumber }];
        });
    };



    const calculatePrice = showtime ? selectedSeats.length * showtime.seatPrice : 0;

     // Format date and time
    const formattedShowtimeDate = showtime ? format(new Date(showtime.start_date), 'dd MMM yyyy') : 'Date Loading';
     const formattedShowtimeTime = showtime ? showtime.start_time : 'Time Loading';

    const handleContinue = async () => {
        // TODO: Implement booking logic
       navigate('/payment', {
            state: {
                selectedSeats: selectedSeats.map(seat => seat.number),
                 showtimeSeatIds: selectedSeats.map(seat => seat.id),
                totalPrice: calculatePrice,
                selectedDate: formattedShowtimeDate,
                selectedTime: formattedShowtimeTime,
                showtimeId: showtimeId, // Add the showtimeId here
                movieTitle: movieTitle,
                 userId: userId
            }
        });
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return <div className="seat-selection" style={{ color: '#ffffff' }}>Loading seats...</div>;
    }

    if (error) {
        return <div className="seat-selection" style={{ color: '#e63946' }}>Error: {error}</div>;
    }

    return (
        <div className="seat-selection">
            <div className="header-ss">
                <h1>{movieTitle}</h1>
                <p>
                   {theatreLocation || "Location Loading"} | {screenFormat || "Format Loading"} | {formattedShowtimeDate} | {formattedShowtimeTime}
                </p>
            </div>

            <div className="screen">SCREEN THIS WAY</div>

            <div className="seating">
                {rows.map((row) => (
                    <div key={row} className="row">
                        {seats[row].map((seat) => {
                            const seatClass = `seat ${
                                seat.status === 'booked'
                                    ? "booked"
                                    : selectedSeats.find(s => s.id === seat.id)
                                        ? "selected"
                                        : "available"
                                }`;

                            return (
                                <div
                                    key={seat.id}
                                    className={seatClass}
                                    onClick={() => handleSeatClick(seat.id, seat.number, seat.status)}
                                >
                                    {seat.number}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="summary">
                <p>Selected Seats: {selectedSeats.map(seat => seat.number).join(", ") || "None"}</p>
                <p>Total Tickets: {selectedSeats.length}</p>
                <p>Total Price: Rs. {calculatePrice}</p>
            </div>

            <div className="actions">
                <button
                    className="continue"
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    style={{ opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
                >
                    Continue
                </button>
                <button className="back" onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;