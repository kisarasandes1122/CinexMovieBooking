import React, { useState, useEffect } from 'react';
import './ShowtimeSelector.css';
import { format, addDays, isSameDay, startOfDay, parse } from 'date-fns';
import { useParams } from 'react-router-dom';

function createSlug(title) {
    if(!title) {
       return ''
    }
    return title
      .toLowerCase()
      .replace(/ /g, '-') // Replace spaces with hyphens
       .replace(/[^\w-]+/g, '')  //remove special characters
}

const ShowtimeSelector = () => {
    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);
    const [dates, setDates] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [screens, setScreens] = useState({});
    const [theatres, setTheatres] = useState({});
    const API_BASE_URL = 'https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api';


    useEffect(() => {
        const fetchMovieTitle = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/movies`);
                if (!response.ok) {
                    const message = `Error fetching movie title: HTTP ${response.status} - ${response.statusText}`;
                    setError(message);
                    console.error(message);
                    return;
                }
                const data = await response.json();
                const movie = data.find((movie) => createSlug(movie.title) === id);
                if (!movie) {
                    const message = `Movie with id ${id} not found`;
                    setError(message);
                    console.error(message);
                    return;
                }
                setMovieTitle(movie.title);
            } catch (err) {
                const message = `Error fetching movie title: ${err.message}`;
                setError(message);
                console.error(message);
            }
        };
        fetchMovieTitle();
    }, [id, API_BASE_URL]);


    useEffect(() => {
        const generateDates = () => {
            const today = new Date();
            const nextSixDays = Array.from({ length: 6 }, (_, i) => addDays(today, i));
            const formattedDates = nextSixDays.map((date, index) => ({
                id: index,
                label: '',
                date: format(date, 'MM/dd'),
            }));
            setDates(formattedDates);
            setSelectedDate(0);
        };

        generateDates();
    }, []);


    useEffect(() => {
        const fetchScreensAndTheatres = async () => {
            setLoading(true);
            try {
                const screenResponse = await fetch(`${API_BASE_URL}/screens`);
                if (!screenResponse.ok) {
                    const message = `Error fetching screens: HTTP ${screenResponse.status} - ${screenResponse.statusText}`;
                    setError(message);
                    console.error(message);
                    return;
                }
                const screenData = await screenResponse.json();

                const theatreResponse = await fetch(`${API_BASE_URL}/theatres`);
                if (!theatreResponse.ok) {
                    const message = `Error fetching theatres: HTTP ${theatreResponse.status} - ${theatreResponse.statusText}`;
                    setError(message);
                    console.error(message);
                    return;
                }
                const theatreData = await theatreResponse.json();


                 const screensMap = screenData.reduce((acc, screen) => {
                    acc[screen._id] = screen;
                   return acc
                  },{})

                const theatreMap = theatreData.reduce((acc, theatre) => {
                  acc[theatre._id] = theatre;
                   return acc;
                },{})


                setScreens(screensMap);
                setTheatres(theatreMap);


            } catch (err) {
                const message = `Error fetching screens and theatres: ${err.message}`;
                setError(message);
                console.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchScreensAndTheatres();
    }, [API_BASE_URL]);


    useEffect(() => {
        const fetchShowtimes = async () => {
            setLoading(true);
            setError(null);
            const selectedDateObj = dates.find(date => date.id === selectedDate);
            if (!selectedDateObj) {
                setLoading(false);
                const message =  `No date selected, cannot fetch showtimes`
                setError(message);
                console.error(message);
                return;
            }

             console.log("selectedDateObj before formatting:", selectedDateObj)


            // Format the date before using it in the API call
            const dateString = format(parse(selectedDateObj.date, 'MM/dd', new Date()), 'yyyy-MM-dd');
             console.log("dateString before fetch:", dateString)


            try {
                const response = await fetch(
                    `${API_BASE_URL}/showtimes/search?title=${movieTitle}&date=${dateString}`
                );
                if (!response.ok) {
                    const message = `Error fetching showtimes: HTTP ${response.status} - ${response.statusText}`;
                    setError(message);
                    console.error(message);
                    return;
                }
                const data = await response.json();
                 const mappedShowtimes = data.map((showtime) => {
                    const showtimeStartDate = startOfDay(new Date(showtime.start_date));
                     const formattedDate = format(showtimeStartDate, 'yyyy-MM-dd')
                     console.log("Formatted Date from API: ", formattedDate)
                    return {
                        ...showtime,
                        start_date: formattedDate
                    };
                });
                setShowtimes(mappedShowtimes);
            } catch (err) {
                const message = `Error fetching showtimes: ${err.message}`;
                setError(message);
                console.error(message);
            } finally {
                setLoading(false);
            }
        };
        if (movieTitle) {
            fetchShowtimes();
        }
    }, [selectedDate, dates, movieTitle, API_BASE_URL]);

    const handleDateClick = (dateId) => {
        setSelectedDate(dateId);
    };

    const handleTimeClick = (showtime) => {
        window.location.href = `/SeatSelection?showtimeId=${showtime._id}&movieTitle=${showtime.movieId.title}`;
    };

    if (loading) {
        return <div>Loading showtimes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
       <div className="showtime-selector">
            <h2>Showtimes & Tickets</h2>
            <div className="date-selector">
                {dates.map((date) => (
                    <button
                        key={date.id}
                        className={`date-button ${selectedDate === date.id ? 'selected' : ''}`}
                        onClick={() => handleDateClick(date.id)}
                    >
                        <div className="date-label">{date.label}</div>
                        <div className="date-value">{date.date}</div>
                    </button>
                ))}
            </div>
            <div className="theaters">
                {showtimes && showtimes.length > 0 ? 
                    Object.values(showtimes.reduce((acc, showtime) => {
                        const screen = screens[showtime.screenId];
                        if (!screen) {
                           return acc;
                        }
                        const theatre = theatres[screen.theatreId];
                        if (!theatre) {
                            return acc;
                        }

                         const showtimeDate = parse(
                            `${showtime.start_date}T${showtime.start_time}`,
                             'yyyy-MM-dd\'T\'h:mm a',
                                new Date()
                            );
                         const timeFormat = format(showtimeDate, 'h:mm a');
                            const screenFormat = screen.format;

                           if (!acc[theatre.location]) {
                                acc[theatre.location] = {
                                    name: theatre.location,
                                    formats: {},
                                };
                            }


                            if(!acc[theatre.location].formats[screenFormat]){
                                 acc[theatre.location].formats[screenFormat] = {
                                     name: screenFormat,
                                     times: []
                                 }
                            }
                              acc[theatre.location].formats[screenFormat].times.push({
                                time: timeFormat,
                                showtime: showtime,
                            });

                        return acc;
                    }, {})).map((theater) => (
                     <div key={theater.name} className="theater">
                        <h3>{theater.name}</h3>
                          {Object.values(theater.formats).map(format => (
                            <div key={format.name} className="format">
                                <h4>{format.name}</h4>
                                <div className="times">
                                   {format.times && format.times.map((timeObj) => (
                                        <button
                                        key={`${timeObj.showtime._id}-${timeObj.time}`}
                                            className={`time-button ${
                                                    selectedTime === `${timeObj.showtime._id}-${timeObj.time}` ? 'selected' : ''
                                                }`}
                                            onClick={() => handleTimeClick(timeObj.showtime)}
                                        >
                                            {timeObj.time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                          ))}
                    </div>
                    )) 
                    :  
                    <div>No Showtimes available for selected date</div>
                }
            </div>
        </div>
    );
};

export default ShowtimeSelector;