import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import './SignIn.css';
import * as jwt_decode from 'jwt-decode';

const SignIn = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInStatus, setSignInStatus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignInStatus("submitting");

        try {
            const response = await fetch('https://0735-2402-4000-2300-2930-744c-1b57-deb8-3da0.ngrok-free.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setSignInStatus("success");
                onLogin(data.token);

                 try {
                       const decodedToken = jwt_decode.jwtDecode(data.token);
                        localStorage.setItem('userId', decodedToken.userId);
                 }
                catch(error){
                    console.error('Error decoding token', error)
                }

                setEmail("");
                setPassword("");
                
                // Navigate to the protected route or home
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setSignInStatus('error');
                const errorData = await response.json();
                console.error('Sign In failed:', errorData.message || "Unknown error");
            }
        } catch (error) {
            setSignInStatus('error');
            console.error('Error during sign in:', error);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <h1>CINEX</h1>
                <h2>Sign into Cinex</h2>
                <form className="signin-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {signInStatus === "submitting" && <p>Submitting the form....</p>}
                    {signInStatus === "success" && <p style={{ color: 'green' }}>Logged in Successfully</p>}
                    {signInStatus === "error" && <p style={{ color: 'red' }}>Sign In Failed. Please try again.</p>}
                    <button type="submit">Sign in</button>
                </form>

                <div className="help-links">
                    <p>Having Trouble in?</p>
                    <a href="/ChangePasswordForm">Reset Password</a> or{" "}
                    <a href="/RegistrationForm">Sign UP</a>
                </div>
            </div>
        </div>
    );
};

export default SignIn;