import React, { useState, useEffect } from 'react';
import { StrictMode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import Home1 from './Pages/home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Moviepage from './Pages/MoviePage';
import SignInform from './components/SignInform/SignIn';
import SeatSelection from './components/MovieSelectionPage/SeatSelection';
import Moviemanagement from './Pages/Moviemanagement';
import TheatreManage from './components/TheatreManage/TheatreManage';
import AdminDash from './components/AdminDashboard/AdminDash';
import Payments from './components/PaymentSection/Payments';
import MMHeader from './components/MMHeader/MMHeader';
import * as jwt_decode from 'jwt-decode';
import BookingConfirmation from './components/BookingConfirm/BookingConfirm';
import ShowtimeMG from './Pages/showtimeMG';
import ChangePasswordForm from './components/ChangePassword/ChangePasswordForm';
import UpcomingBookingDetail from './components/UpcomingBookingDetail/UpcomingBookingDetail';
import MovieBookingpage from './Pages/MovieBookingpage';
import AdminSignin from './Pages/AdminSignIn';
import OffersAndDeals from './components/OffersSection/OfferPage';
import AboutUs from './Pages/AboutUs';
import Bookinghistory from './Pages/Bookinghistory';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/SignInform" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwt_decode.jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to="/SignInform" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/SignInform" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <StrictMode>
      <Router>
        <AppContent />
      </Router>
    </StrictMode>
  );
};

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  };


  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout}  setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/booking/:id" element={<MovieBookingpage />} />
        <Route path="/RegistrationForm" element={<RegistrationForm />} />
        <Route path="/Moviepage" element={<Moviepage />} />
        <Route path="/SignInform" element={<SignInform onLogin={handleLoginSuccess} />} />
        <Route path="/SeatSelection" element={<SeatSelection />} />
        <Route path="/AdminDashboard" element={<AdminDash />} />
         <Route path="/AdminSignIn" element={<AdminSignin/>} />
        <Route path="/Moviemanagement" element={<Moviemanagement />} />
        <Route path="/TheatreManage" element={<TheatreManage />} />
        <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route path="/Aboutus" element={<AboutUs/>} />
        <Route path="/MMHeader" element={<MMHeader />} />
        <Route path="/ShowtimeMG" element={<ShowtimeMG />} />
        <Route path="/ChangePasswordForm" element={<ChangePasswordForm />} />
        <Route path="/UpComingBooking" element={<UpcomingBookingDetail />} />
        <Route path="/OffersSection" element={<OffersAndDeals/>}/>
        <Route path="/Bookinghistory" element={<Bookinghistory/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;