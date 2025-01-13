import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PromoCode from './PromoCode.jsx';
import PaymentMethod from './PaymentMethod.jsx';
import UserDetails from './UserDetails.jsx';
import './PaymentMethod.css';

const Payments = () => {
    const location = useLocation();
    const { selectedSeats, totalPrice, selectedDate, selectedTime, showtimeSeatIds, showtimeId, movieTitle, userId } = location.state || {};
    const [discountedPrice, setDiscountedPrice] = useState(totalPrice)

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="section">
                    <h1 className="mn-title">{movieTitle}</h1>
                    <p>Date: {selectedDate} | Time: {selectedTime}</p>
                    <p>Selected Seats: {selectedSeats ? selectedSeats.join(', ') : 'No seats selected'}</p>
                     <p>User ID: {userId || 'No user ID'}</p>
                    <div className="summary-row summary-total">
                        <span>Total: </span>
                         <span>Rs. {discountedPrice}</span>
                    </div>
                </div>

                 <PromoCode setDiscountedPrice={setDiscountedPrice} totalPrice={totalPrice} />
                <UserDetails />
                <PaymentMethod />
                
            </div>
        </div>
    );
};

export default Payments;