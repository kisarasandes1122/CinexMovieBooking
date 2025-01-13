import { useEffect, useState } from 'react';

const PaymentMethod = ({ discountedPrice, movieTitle, selectedDate, selectedTime, selectedSeats, userId, showtimeId, showtimeSeatIds, setPaymentSuccess }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);


    useEffect(() => {
        const existingScript = document.querySelector('script[src*="paypal"]');

        const handleScriptLoad = () => {
            setScriptLoaded(true);
            if (window.paypal) {
                const buttonContainer = document.getElementById('paypal-button-container');
                if (buttonContainer) {
                    buttonContainer.innerHTML = '';
                }
                window.paypal.Buttons({
                    style: {
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal'
                    },
                    createOrder: (data, actions) => {
                        const usdAmount = discountedPrice / 300;

                        const description = `Movie: ${movieTitle}, Date: ${selectedDate}, Time: ${selectedTime}, Seats: ${selectedSeats.join(', ')}`;

                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: usdAmount.toFixed(2),
                                    currency_code: 'USD'
                                },
                                description: description
                            }]
                        });
                    },
                    onApprove: async (data, actions) => {
                      try {
                            const order = await actions.order.capture();
                            console.log("Payment successful!", order);

                           const bookingData = {
                              userId: userId,
                             showtimeId: showtimeId,
                             showtimeSeatIds: showtimeSeatIds
                           }

                           const response = await fetch('http://localhost:27017/api/bookings/', {
                             method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            body: JSON.stringify(bookingData)
                             })
                           if(!response.ok) {
                             const errorData = await response.json();
                               throw new Error(`Booking creation failed: ${errorData.message || 'Unknown error'}`)
                           }
                          setPaymentSuccess(true);
                            console.log("Booking successful!");
                       } catch (error) {
                            console.error("Payment failed or Booking failed:", error);
                            setScriptError(true);
                        }
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err);
                        setScriptError(true);
                    }
                }).render('#paypal-button-container')
                    .catch(err => {
                        console.error("Render error:", err);
                        setScriptError(true);
                    });
            }
        };

        const handleScriptError = () => {
            console.error("PayPal script failed to load");
            setScriptError(true);
        };

        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://www.paypal.com/sdk/js?client-id=AYWsDXidFtXjHrGqecjWAR9O2XOMSGZFSz88tLGFrF9WxRosm0yDF0ENC220mMEoe7za6qB325LBxbXs&currency=USD&intent=capture`;
          script.async = true;
          script.onload = handleScriptLoad;
          script.onerror = handleScriptError;
          document.body.appendChild(script);
        } else {
            handleScriptLoad();
        }
    }, [discountedPrice, movieTitle, selectedDate, selectedTime, selectedSeats, userId, showtimeId, showtimeSeatIds, setPaymentSuccess]);

    return (
        <div className="payment-section">
            <h2 className="text-white text-2xl font-bold mb-6">SELECT YOUR PAYMENT MODE</h2>
            <div className="bg-[#2a2a2a] p-6 rounded-lg">
                <div id="paypal-button-container" className="max-w-md mx-auto" />
                {scriptError && (
                    <div className="text-red-500 text-center mt-4">
                        Something went wrong. Please try again later.
                    </div>
                )}
                {!scriptLoaded && !scriptError && (
                    <div className="text-gray-400 text-center mt-4">
                        Loading payment options...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;