const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
 const movieRoutes = require('./routes/movieRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes')
 const theatreRoutes = require('./routes/theatreRoutes');
 const bookingRoutes = require('./routes/bookingRoutes');
 const authRoutes = require('./routes/authRoutes');
 const screenRoutes = require('./routes/screenRoute'); // ADD THIS LINE
 dotenv.config();


const app = express();
 app.use(express.json());
 
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

//Parse application/json
app.use(bodyParser.json())


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
console.error('Error connecting to MongoDB:', error);
});


//Define basic route
app.get('/', (req, res) => {
      res.send('Hello from backend server')
 });


app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes)
app.use('/api/theatres', theatreRoutes);
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/screens', screenRoutes); // ADD THIS LINE

module.exports = app;