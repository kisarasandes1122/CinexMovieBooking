# CinexMovieBooking

CinexMovieBooking is a comprehensive web application for movie ticket booking and cinema management. This full-stack application provides an intuitive interface for users to browse movies, select showtimes, book seats, and complete payments, while also offering administrative capabilities for cinema management.

## Project Overview

CinexMovieBooking is built using modern web technologies with a React frontend and Node.js/Express backend. The application aims to provide a seamless movie booking experience with features such as user authentication, movie browsing, seat selection, payment processing, and booking management. The admin panel allows cinema managers to manage movies, theaters, showtimes, and view booking analytics.

### Key Features

The application includes the following key features:

- User authentication and registration system
- Movie browsing with search functionality
- Detailed movie information pages
- Theater and showtime selection
- Interactive seat selection interface
- Secure payment processing
- Booking confirmation and history
- Special offers and promotions
- Admin dashboard for cinema management
- Movie, theater, and showtime management for administrators
- Responsive design for mobile and desktop devices

## Technology Stack

### Frontend
- React.js with Vite as the build tool
- React Router for navigation
- Modern JavaScript (ES6+)
- CSS for styling
- Various React libraries:
  - react-slick for carousels
  - react-select for enhanced select inputs
  - react-loader-spinner for loading animations
  - date-fns for date manipulation
  - JWT decode for authentication

### Backend
- Node.js with Express framework
- MongoDB with Mongoose for database operations
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin resource sharing
- dotenv for environment variable management
- shortid for generating unique identifiers

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas account)

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CinexMovieBooking.git
cd CinexMovieBooking
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with necessary environment variables:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinexmovie
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
node src/index.js
```

The backend API will be available at `http://localhost:5000`.

## Project Structure

### Frontend Structure

```
src/
├── assets/           # Static assets like images and icons
├── components/       # Reusable UI components
│   ├── AdminDashboard/     # Admin dashboard components
│   ├── BookingConfirm/     # Booking confirmation components
│   ├── ChangePassword/     # Password change form
│   ├── Footer/            # Footer component
│   ├── Home/              # Homepage components
│   ├── MMHeader/          # Management header components
│   ├── MovieDetails/      # Movie details components
│   ├── MovieList/         # Movie listing components
│   ├── MovieSelectionPage/ # Seat selection components
│   ├── Navbar/            # Navigation bar
│   ├── OffersSection/     # Offers and promotions
│   ├── PaymentSection/    # Payment processing components
│   ├── ProtectedRoute/    # Route protection components
│   ├── RegistrationForm/  # User registration components
│   ├── ShowtimeMG/        # Showtime management
│   ├── Showtimes/         # Showtime selection components
│   ├── SignInform/        # Sign-in components
│   ├── TheatreManage/     # Theater management components
│   ├── UpcomingBookingDetail/ # Upcoming booking components
│   └── UpcomingMovie/     # Upcoming movie components
├── Pages/            # Page components that combine smaller components
├── App.jsx           # Main application component with routing
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

### Backend Structure

```
src/
├── controllers/     # Request handlers for different routes
├── middleware/      # Custom middleware functions
├── models/          # Mongoose data models
├── routes/          # API route definitions
├── app.js           # Express application setup
└── index.js         # Server entry point
```

## Usage Guide

### User Flow

1. **Homepage**: Users are greeted with featured movies, upcoming releases, and special offers.

2. **Movie Browsing**: Users can browse through available movies, search for specific titles, or filter by genre, language, or release date.

3. **Movie Details**: Clicking on a movie displays detailed information including synopsis, cast, ratings, and available showtimes.

4. **Authentication**: Users need to sign in or register to proceed with booking. The application uses JWT for secure authentication.

5. **Showtime Selection**: Users select their preferred date, theater, and showtime.

6. **Seat Selection**: An interactive seating chart allows users to select available seats. The system shows already booked seats and pricing for different seat categories.

7. **Payment**: Users enter their details, apply any promo codes, and select a payment method to complete their booking.

8. **Confirmation**: Upon successful payment, users receive a booking confirmation with details and a unique booking ID.

9. **Booking History**: Users can view their upcoming and past bookings in their account section.

### Admin Flow

1. **Admin Login**: Administrators access the system through a separate login page.

2. **Dashboard**: The admin dashboard provides an overview of bookings, revenue, and occupancy rates.

3. **Movie Management**: Admins can add, edit, or remove movies from the system, including details like synopsis, cast, runtime, and poster images.

4. **Theater Management**: Admins can manage theaters, including seating layouts and capacities.

5. **Showtime Management**: Admins can schedule showtimes for movies across different theaters.

6. **Offers Management**: Special offers and promotions can be created and managed through the admin interface.

## Development

### Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode with hot reloading
- `npm run build`: Builds the app for production
- `npm run lint`: Runs ESLint to check code quality
- `npm run preview`: Previews the production build locally

### Backend Scripts

In the backend directory:

- `node src/index.js`: Starts the backend server

## Deployment

### Frontend Deployment

The frontend can be built for production using:

```bash
npm run build
```

This creates a `dist` folder with optimized production files that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Backend Deployment

The backend can be deployed to services like Heroku, Railway, or any Node.js hosting platform. Make sure to set the appropriate environment variables in your deployment environment.

## Contributing

Contributions to the CinexMovieBooking project are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgements

- React and Vite teams for the excellent development tools
- MongoDB for the database solution
- Express.js for the backend framework
- All the open-source libraries used in this project
