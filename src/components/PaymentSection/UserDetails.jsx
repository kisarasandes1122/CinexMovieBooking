import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';

const UserDetails = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if(!userId) return;
             setLoading(true);
            try{
             const response = await apiService.auth.getUserById(userId);
             const data = response.data;
              setUserDetails(data);
            }
            catch(error){
              const errorMessage = handleApiError(error, 'Failed to fetch user details');
              setError(errorMessage);
             }
            finally{
              setLoading(false)
            }
        }
      fetchUserDetails();
    }, [userId]);


    if (loading) {
        return <div className="section">Loading user details...</div>;
    }

    if (error) {
        return <div className="section" style={{ color: 'red' }}>Error fetching user details: {error}</div>;
    }


    return (
      <div className="section">
        <hr />
        <h2 className="title">YOUR DETAILS</h2>
        <p className="subtitle">Fill Your Details</p>
        <div>
           <input
            type="text"
            placeholder="First Name & Last Name"
            className="input"
            value={`${userDetails.firstName || ''} ${userDetails.lastName || ''}`}
            readOnly
          />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="input"
              value={userDetails.mobile || ''}
              readOnly
             />
             <input
                type="email"
                placeholder="Email Address"
                className="input"
                 value={userDetails.email || ''}
                readOnly
             />
          <div className="checkbox-container">
            <input className="checkbox" type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to the <a href="#" className="terms-link">Terms and Conditions</a>
            </label>
          </div>
        </div>
      </div>
    );
  };
  export default UserDetails;