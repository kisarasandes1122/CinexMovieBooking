import { useState } from 'react';
import './RegistrationForm.css';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
    receiveOffers: false,
    agreeToTerms: false
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // State for registration status

  const handleSubmit = async (e) => {
      e.preventDefault();
      setRegistrationStatus("submitting") //Set submit status
      
    try {
        const response = await apiService.auth.register(formData);
        
        if (response.data) {
          setRegistrationStatus('success');
          const data = response.data;
          console.log('Registration successful', data);
           // Optionally, clear the form here if needed
        setFormData({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              mobile: '',
              receiveOffers: false,
              agreeToTerms: false
        });
        }
    } catch (error) {
      setRegistrationStatus('error');
      const errorMessage = handleApiError(error, 'Registration failed');
      console.error('Error during registration:', errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="registration-container">
      <div className="form-header">
        <h1>CINEX</h1>
        <h2>Become a Cinex Member</h2>
      </div>
      <div><hr /></div>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="receiveOffers"
              checked={formData.receiveOffers}
              onChange={handleChange}
            />
            Receive Offers
          </label>
          
          <label>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            Have read and agree to the terms and conditions
          </label>
        </div>
       
         {registrationStatus === "submitting" && <p>Submitting the form....</p>}
          {registrationStatus === "success" && <p style={{color: 'green'}}>Registration Successfull!</p>}
         {registrationStatus === "error" && <p style={{color: 'red'}}>Registration Failed. Please try again.</p>}

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default RegistrationForm;