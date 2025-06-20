import React, { useState, useEffect } from 'react';
import './ShowtimeSelector.css';
import { format, addDays, isSameDay, startOfDay, parse, isValid } from 'date-fns';
import { useParams } from 'react-router-dom';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

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


    useEffect(() => {
        const fetchMovieTitle = async () => {
            try {
                const response = await apiService.movies.getAll();
                const data = response.data;
                const movie = data.find((movie) => createSlug(movie.title) === id);
                if (!movie) {
                    const message = `Movie with id ${id} not found`;
                    setError(message);
                    console.error(message);
                    return;
                }
                setMovieTitle(movie.title);
            } catch (err) {
                const errorMessage = handleApiError(err, 'Failed to fetch movie title');
                setError(errorMessage);
                console.error(errorMessage);
            }
        };
        fetchMovieTitle();
    }, [id]);


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
                const screenResponse = await apiService.screens.getAll();
                const screenData = screenResponse.data;

                const theatreResponse = await apiService.theatres.getAll();
                const theatreData = theatreResponse.data;

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
                const errorMessage = handleApiError(err, 'Failed to fetch screens and theatres');
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchScreensAndTheatres();
    }, []);


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
            try {
                const parsedDate = parse(selectedDateObj.date, 'MM/dd', new Date());
                if (!isValid(parsedDate)) {
                    const message = `Invalid date format: ${selectedDateObj.date}`;
                    setError(message);
                    console.error(message);
                    setLoading(false);
                    return;
                }
                const dateString = format(parsedDate, 'yyyy-MM-dd');
                console.log("dateString before fetch:", dateString);

                const response = await apiService.showtimes.search({
                    title: movieTitle,
                    date: dateString
                });
                const data = response.data;
                const mappedShowtimes = data.map((showtime) => {
                    try {
                        const showtimeStartDate = new Date(showtime.start_date);
                        if (!isValid(showtimeStartDate)) {
                            console.warn('Invalid start_date from API:', showtime.start_date);
                            return null;
                        }
                        const formattedStartDate = startOfDay(showtimeStartDate);
                        const formattedDate = format(formattedStartDate, 'yyyy-MM-dd');
                        console.log("Formatted Date from API: ", formattedDate);
                        return {
                            ...showtime,
                            start_date: formattedDate
                        };
                    } catch (error) {
                        console.warn('Error processing showtime date:', error, showtime);
                        return null;
                    }
                }).filter(Boolean); // Remove null entries
                setShowtimes(mappedShowtimes);
            } catch (err) {
                const errorMessage = handleApiError(err, 'Failed to fetch showtimes');
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        if (movieTitle) {
            fetchShowtimes();
        }
    }, [selectedDate, dates, movieTitle]);

    const handleDateClick = (dateId) => {
        setSelectedDate(dateId);
    };

    const handleTimeClick = (showtime) => {
        window.location.href = `/SeatSelection?showtimeId=${showtime._id}&movieTitle=${showtime.movieId.title}`;
    };

    if (loading) {
        return (
            <div className="showtime-selector">
                <div className="loading-spinner">
                    <div>🎬 Loading showtimes...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="showtime-selector">
                <div className="error-message">
                    ⚠️ {error}
                </div>
            </div>
        );
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
                        <div className="date-label">
                            {date.id === 0 ? 'TODAY' : date.id === 1 ? 'TOMORROW' : `DAY ${date.id + 1}`}
                        </div>
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

                        // Validate showtime data before parsing
                        if (!showtime.start_date || !showtime.start_time) {
                            console.warn('Invalid showtime data:', showtime);
                            return acc;
                        }

                        try {
                            const showtimeDate = parse(
                                `${showtime.start_date}T${showtime.start_time}`,
                                'yyyy-MM-dd\'T\'HH:mm',
                                new Date()
                            );
                            
                            // Validate the parsed date
                            if (!isValid(showtimeDate)) {
                                console.warn('Invalid parsed date for showtime:', showtime);
                                return acc;
                            }
                            
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
                        } catch (error) {
                            console.warn('Error parsing showtime date:', error, showtime);
                        }

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
                    <div className="no-showtimes">
                        🎭 No showtimes available for the selected date.<br/>
                        Please try another date.
                    </div>
                }
            </div>
        </div>
    );
};

export default ShowtimeSelector;