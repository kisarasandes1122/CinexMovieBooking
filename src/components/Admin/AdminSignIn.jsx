import React, { useState } from "react";
import './css/AdminSignIn.css';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInStatus, setSignInStatus] = useState(null); // State for login status
    const [token, setToken] = useState(null); // State to store the token

    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@cinex.com";
    const ADMIN_PASSWORD = "Admin@123";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignInStatus("submitting"); // Set login status

        // Check if the user is an admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setSignInStatus("success");
            console.log("Admin logged in successfully");
            // Set a dummy token for admin
            setToken("admin-token-123");
            setEmail("");
            setPassword("");
            return; // Skip further API request for admin login
        }

        try {
            const response = await fetch('http://localhost:27017/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                setSignInStatus("success"); // Set sign-in status to success
                const data = await response.json();
                console.log("Logged in successfully", data);
                setToken(data.token); // Set token to state variable
                // Clear the form
                setEmail("");
                setPassword("");
                // Optional: Redirect user here
            } else {
                setSignInStatus('error');
                try {
                    const errorData = await response.json();
                    console.error('Sign In failed:', errorData.message || "Unknown error");
                } catch (err) {
                    console.error("Sign In Failed:", err);
                }
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
                    <a href="/reset-password">Reset Password</a> or{" "}
                    <a href="/RegistrationForm">Sign UP</a>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
