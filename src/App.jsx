import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home1 from './Pages/home';
import Navbar from './components/Navbar/Navbar';
import MovieBooking from './Pages/MovieBooking'; // Import the MovieBooking component
import Footer from './components/Footer/Footer';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Moviepage from './Pages/MoviePage';
import SignInform from './components/SignInform/SignIn';


const App = () => {
  return (
    <StrictMode>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home1 />} />
            <Route path="/booking/:id" element={<MovieBooking />} />
            <Route path="/RegistrationForm" element={<RegistrationForm />} />
            <Route path="/Moviepage" element={<Moviepage />} />
            <Route path="/SignInform" element={<SignInform />} />
          </Routes>
          <Footer/>
        </div>
      </Router>
    </StrictMode>
  );
};

export default App;