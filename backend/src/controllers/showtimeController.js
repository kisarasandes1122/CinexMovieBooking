// -- START OF FILE showtimeController.js --
const Showtime = require('../models/showtimeModel');
const Screen = require('../models/screenModel');
const Seat = require('../models/seatModel');
const ShowtimeSeats = require('../models/showtimeSeatsModel');
const Movie = require('../models/movieModel');
const { startOfDay, endOfDay, isBefore, addDays, isSameDay } = require('date-fns');


const getShowtimesByMovieTitleAndDate = async (req, res) => {
    try {
        const { title, date } = req.query;
        if (!title || !date) {
            return res.status(400).json({ message: 'Title and date are required' });
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        // Get the start and end of day for the parsed date
        const startDate = startOfDay(parsedDate);
        const endDate = endOfDay(parsedDate);


        // Find the movie by title
        const movie = await Movie.findOne({ title: { $regex: new RegExp(title, 'i') } });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }


        const showtimes = await Showtime.find({
            movieId: movie._id,
            start_date: { $gte: startDate, $lte: endDate }  // check if the date is within the selected date
        }).populate('movieId', 'title')


        res.json(showtimes);

    } catch (err) {
        res.status(500).json({ message: "Error fetching showtimes", error: err.message });
    }
};


const createShowtime = async (req, res) => {
    const debugInfo = {
        stage: "initial",
        messages: [],
    };
    try {
        const { movieId, screenId, start_date, start_time, seatPrice, recurrence } = req.body;
        debugInfo.stage = "parameters-extracted";
        debugInfo.messages.push("Parameters extracted from request body");

        const screen = await Screen.findById(screenId);
        if (!screen) {
            debugInfo.stage = "screen-not-found"
            debugInfo.messages.push(`Screen with id ${screenId} not found`);
            return res.status(400).json({ message: 'Invalid screenId', debug: debugInfo });
        }
        debugInfo.stage = "screen-found"
        debugInfo.messages.push(`Screen with id ${screenId} found`);

        const startTimeDate = new Date(start_date);
        if (isNaN(startTimeDate)) {
            debugInfo.stage = "invalid-date"
            debugInfo.messages.push(`Invalid start_date`);
            return res.status(400).json({ message: 'Invalid start_date', debug: debugInfo });
        }

        debugInfo.stage = "dates-validated"
        debugInfo.messages.push(`Dates validated`);

        let showtimesToInsert = [];

        const seats = await Seat.find({ screenId: screen._id });
        debugInfo.stage = "seats-fetched"
        debugInfo.messages.push(`Seats fetched for screen: ${seats.length} seats`);
        debugInfo.seats = seats; // Added for debugging purpose

        if (seats.length === 0) {
            debugInfo.stage = "no-seats-found"
            debugInfo.messages.push(`No seats found for screen ${screenId}`);
            return res.status(400).json({ message: 'No seats found for this screen', debug: debugInfo });
        }



        if (recurrence?.type === "daily") {
            debugInfo.stage = "daily-recurrence-started";
            debugInfo.messages.push("Daily recurrence started");
            let startDate = new Date(start_date);
            let endDate = recurrence?.endDate ? new Date(recurrence.endDate) : null;

            let count = 0;
            const MAX_RECURRENCE = 365 // Limit to 1 year

            while (!endDate || (isBefore(startDate, endDate) || isSameDay(startDate, endDate)) && count < MAX_RECURRENCE) {
                const newShowtime = new Showtime({
                    movieId,
                    screenId,
                    start_date: startOfDay(startDate),
                    start_time,
                    seatPrice,
                    recurrence
                });
                showtimesToInsert.push(newShowtime)
                debugInfo.messages.push(`Showtime about to insert: ${JSON.stringify(newShowtime)}`);
                startDate = addDays(startDate, 1);
                count++;
            }
            debugInfo.stage = "showtimes-generated";
            debugInfo.messages.push(`Showtimes generated`);

            if (count === MAX_RECURRENCE) {
                debugInfo.stage = "max-recurrence-reached";
                debugInfo.messages.push("Max recurrence limit reached");
                return res.status(400).json({ message: 'Too many recurring showtimes generated.', debug: debugInfo });
            }
            let savedShowtimes;
            try {
                savedShowtimes = await Showtime.insertMany(showtimesToInsert);
                debugInfo.stage = "showtimes-saved";
                debugInfo.messages.push(`Showtimes saved in DB ${JSON.stringify(savedShowtimes)}`);
            }
            catch (insertError) {
                debugInfo.stage = "showtimes-saving-failed";
                debugInfo.messages.push(`Showtimes saving in DB failed ${insertError.message}`);
                return res.status(500).json({ message: 'Error creating showtimes', error: insertError.message, debug: debugInfo });
            }

            const allShowtimeSeats = [];
            for (const savedShowtime of savedShowtimes) {
                debugInfo.messages.push(`Processing showtime id: ${savedShowtime._id}`);
                const showtimeSeats = seats.map(seat => {
                    debugInfo.messages.push(`Processing seat id: ${seat._id}`);
                    return {
                        showtimeId: savedShowtime._id,
                        seatId: seat._id,
                        status: "available"
                    }
                });
                allShowtimeSeats.push(...showtimeSeats)
            }
            debugInfo.stage = "all-showtime-seats-generated";
            debugInfo.messages.push(`All showtime seats generated ${JSON.stringify(allShowtimeSeats)}`);
            try {
                await ShowtimeSeats.insertMany(allShowtimeSeats);
                debugInfo.stage = "showtime-seats-saved";
                debugInfo.messages.push("Showtime seats saved in DB");
            } catch (insertError) {
                debugInfo.stage = "showtime-seats-saving-failed";
                debugInfo.messages.push(`Error inserting showtime seats: ${insertError.message}`);
                return res.status(500).json({ message: 'Error creating showtime seats', error: insertError.message, debug: debugInfo });
            }
            res.status(201).json({ message: "Successfully created showtimes", showtimes: savedShowtimes, debug: debugInfo });

        } else {
            debugInfo.stage = "non-recurring-showtime-started";
            debugInfo.messages.push("Non-recurring showtime");
            const newShowtime = new Showtime({
                movieId,
                screenId,
                start_date: startTimeDate,
                start_time,
                seatPrice,
                recurrence
            });
            let savedShowtime
            try {
                savedShowtime = await newShowtime.save();
                debugInfo.stage = "showtime-saved";
                debugInfo.messages.push(`Showtime saved in DB ${JSON.stringify(savedShowtime)}`);
            }
            catch (insertError) {
                debugInfo.stage = "showtime-saving-failed";
                debugInfo.messages.push(`Showtime saving in DB failed ${insertError.message}`);
                return res.status(500).json({ message: 'Error creating showtime', error: insertError.message, debug: debugInfo });
            }

            const showtimeSeats = seats.map(seat => {
                debugInfo.messages.push(`Processing seat id: ${seat._id}`);
                return {
                    showtimeId: savedShowtime._id,
                    seatId: seat._id,
                    status: "available"
                }
            })
            debugInfo.stage = "showtime-seats-generated";
            debugInfo.messages.push(`Showtime seats generated ${JSON.stringify(showtimeSeats)}`);
            try {
                await ShowtimeSeats.insertMany(showtimeSeats);
                debugInfo.stage = "showtime-seats-saved";
                debugInfo.messages.push(`Showtime seats saved in DB`);
            } catch (insertError) {
                debugInfo.stage = "showtime-seats-saving-failed";
                debugInfo.messages.push(`Error inserting showtime seats: ${insertError.message}`);
                return res.status(500).json({ message: 'Error creating showtime seats', error: insertError.message, debug: debugInfo });
            }
            res.status(201).json({ message: "Successfully created showtime", showtime: savedShowtime, debug: debugInfo });
        }
    } catch (err) {
        debugInfo.stage = "catch-error";
        debugInfo.messages.push(`Error in catch block: ${err.message}`);
        res.status(400).json({ message: "Error creating showtime", error: err.message, debug: debugInfo });
    }
};

// Controller method to get showtime seats by showtimeSeatId or showtimeSeatIds
const getShowtimeSeatsByShowtimeSeatId = async (req, res) => {
    try {
        const { showtimeSeatIds } = req.query;

        if (!showtimeSeatIds) {
            return res.status(400).json({ message: 'showtimeSeatIds parameter is required' });
        }

        const idsArray = showtimeSeatIds.split(','); // Split comma-separated IDs

        const showtimeSeats = await ShowtimeSeats.find({ _id: { $in: idsArray } })
            .populate({
                path: 'seatId',
                model: 'Seats',
                select: 'seatNumber'
            })
            .lean();

        if (!showtimeSeats || showtimeSeats.length === 0) {
            return res.status(404).json({ message: 'No showtime seats found with provided IDs' });
        }
        const formattedSeats = showtimeSeats.map(showtimeSeat => ({
            _id: showtimeSeat._id,
            seatNumber: showtimeSeat.seatId.seatNumber,
            status: showtimeSeat.status
        }));


        res.json(formattedSeats);

    } catch (err) {
        res.status(500).json({ message: "Error fetching showtime seats", error: err.message });
    }
};

//New controller method to get showtime seats by showtimeId
const getShowtimeSeatsByShowtimeId = async (req, res) => {
    try {
        const { showtimeId } = req.params;

        const showtimeSeats = await ShowtimeSeats.find({ showtimeId: showtimeId })
            .populate({
                path: 'seatId',
                model: 'Seats',
                select: 'seatNumber'
            })
            .lean();


        if (!showtimeSeats || showtimeSeats.length === 0) {
            return res.status(404).json({ message: 'No seats found for this showtime' });
        }
        const formattedSeats = showtimeSeats.map(showtimeSeat => ({
            _id: showtimeSeat._id,
            seatNumber: showtimeSeat.seatId.seatNumber,
            status: showtimeSeat.status
        }));


        res.json(formattedSeats);

    } catch (err) {
        res.status(500).json({ message: "Error fetching showtime seats", error: err.message });
    }
};

//Get a showtime by id.
const getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate({
                path: 'movieId',
                model: 'Movie',
            })
            .populate({
                path: 'screenId',
                model: 'Screens',
                populate: {
                    path: 'theatreId',
                    model: 'Theatre'
                }
            });


        if (!showtime) {
            return res.status(404).json({ message: 'Cannot find showtime' });
        }
        res.json(showtime);
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Error fetching showtime', error: err.message });
    }
};


//Get all showtimes
const getAllShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.find({}).populate('movieId', 'title');
        res.json(showtimes)
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching showtimes", error: err.message })
    }
}

//Get all showtimes with additional info
const getAllShowtimesWithAllDetails = async (req, res) => {
    try {
        const showtimes = await Showtime.find({})
            .populate({
                path: 'movieId',
                model: 'Movie',
                select: 'title'
            })
            .populate({
                path: 'screenId',
                model: 'Screens',
                populate: {
                    path: 'theatreId',
                    model: 'Theatre',
                    select: 'location'
                },
                select: 'screenNumber format'
            })
            .lean(); // using lean to convert mongoose object to javascript object

        const formattedShowtimes = showtimes.map(showtime => {
            const endDate = showtime.recurrence?.type === "daily" ? showtime.recurrence?.endDate : null
            return {
                _id: showtime._id,
                movieTitle: showtime.movieId.title,
                theatreLocation: showtime.screenId.theatreId.location,
                screenNumber: showtime.screenId.screenNumber,
                startDate: showtime.start_date,
                 recurrenceType: showtime.recurrence?.type || "none",
                endDate: endDate,
                startTime: showtime.start_time,
                screenFormat: showtime.screenId.format,
                seatPrice: showtime.seatPrice,
            };
        });

        res.json(formattedShowtimes);
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching showtimes", error: err.message })
    }
}

// Delete a showtime by id.
const deleteShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if (!showtime) {
            return res.status(404).json({ message: 'Cannot find showtime' })
        }
        res.json({ message: 'Showtime deleted' })
    }
    catch (err) {
        return res.status(500).json({ message: "Error deleting showtime", error: err.message })
    }
}


// New controller to delete a showtime by showtime id and associated showtime seats
const deleteShowtimeByShowtimeId = async (req, res) => {
  const { id } = req.params;
  try {
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Cannot find showtime' });
    }

    // Delete associated showtime seats
    await ShowtimeSeats.deleteMany({ showtimeId: id });

    // Delete the showtime
    await Showtime.findByIdAndDelete(id);


    res.json({ message: 'Showtime and associated seats deleted successfully' });
  } catch (err) {
     return res.status(500).json({ message: "Error deleting showtime", error: err.message });
  }
};


// Update a showtime
const updateShowtimeById = async (req, res) => {
    try {
        const updatedShowtime = await Showtime.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedShowtime) {
            return res.status(404).json({ message: 'Cannot find showtime' })
        }
        res.json(updatedShowtime);
    }
    catch (err) {
        return res.status(500).json({ message: "Error updating showtime", error: err.message })
    }
}

// New controller to get showtime count starting from today
const getShowtimeCountFromToday = async (req, res) => {
    try {
       const today = startOfDay(new Date());

        const count = await Showtime.countDocuments({
            start_date: { $gte: today }
        });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: "Error fetching showtime count", error: err.message });
    }
};

module.exports = {
    getShowtimesByMovieTitleAndDate,
    createShowtime,
    getShowtimeById,
     deleteShowtimeById,
    updateShowtimeById,
    getShowtimeSeatsByShowtimeId,
    getShowtimeSeatsByShowtimeSeatId,
    getAllShowtimes,
    getAllShowtimesWithAllDetails,
    deleteShowtimeByShowtimeId, // new controller
    getShowtimeCountFromToday // new controller
};