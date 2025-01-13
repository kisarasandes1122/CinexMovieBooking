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
import MovieBooking from './Pages/MovieBooking';
import Footer from './components/Footer/Footer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Moviepage from './Pages/MoviePage';
import SignInform from './components/SignInform/SignIn';
import SeatSelection from './components/MovieSelectionPage/SeatSelection';
import Header from './components/Yokis/Header';
import AdminSignIn from './Pages/AdminSignIn';
import ContactUS from './components/ContactUS/Contactus';
import Moviemanagement from './Pages/Moviemanagement';
import TheatreManage from './components/TheatreManage/TheatreManage';
import AdminDash from './components/AdminDashboard/AdminDash';
import Payments from './components/PaymentSection/Payments';
import MMHeader from './components/MMHeader/MMHeader';
import ShowtimeManagement from './Pages/showtimeMG';
import * as jwt_decode from 'jwt-decode';
import BookingConfirmation from './components/BookingConfirm/BookingConfirm';
import OffersAndDeals from './Pages/OfferPage';

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
        navigate(from);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/SignInform');
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home1 />} />
                <Route path="/booking/:id" element={<MovieBooking />} />
                <Route path="/RegistrationForm" element={<RegistrationForm />} />
                <Route path="/Moviepage" element={<Moviepage />} />
                <Route path="/SignInform" element={<SignInform onLogin={handleLoginSuccess} />} />
                <Route path="/SeatSelection" element={<SeatSelection />} />
                <Route path="/Header" element={<Header />} />
                <Route path="/AdminDashboard" element={<AdminDash />} />
                <Route path="/AdminSignIn" element={<AdminSignIn />} />
                <Route path="/Moviemanagement" element={<Moviemanagement />} />
                <Route path="/TheatreManage" element={<TheatreManage />} />
                <Route path="/BookingConfirmation" element={<BookingConfirmation/>} />
                <Route 
                    path="/payment" 
                    element={
                        <ProtectedRoute>
                            <Payments />
                        </ProtectedRoute>
                    }
                />
                <Route path="/Contactus" element={<ContactUS />} />
                <Route path="/MMHeader" element={<MMHeader />} />
                <Route path="/showtimeMG" element={<ShowtimeManagement/>}/>
                <Route path="/OfferPage" element={<OffersAndDeals/>}/>
            </Routes>
            <Footer />
        </div>
    );
};

export default App;