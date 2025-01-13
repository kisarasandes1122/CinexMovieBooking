import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './AdminSignIn.css';

const AdminSignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInStatus, setSignInStatus] = useState(null);
    const [token, setToken] = useState(null);

    const navigate = useNavigate(); // Initialize navigate

    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@cinex.com";
    const ADMIN_PASSWORD = "Admin@123";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignInStatus("submitting");

        // Check if the user is an admin
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setSignInStatus("success");
            console.log("Admin logged in successfully");
            setToken("admin-token-123");
            setEmail("");
            setPassword("");

            // Navigate to Admin Dashboard
            navigate("/AdminDashboard");
            return;
        }

        try {
            const response = await fetch("http://localhost:27017/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.role === "admin") {
                    setSignInStatus("success");
                    console.log("Admin logged in successfully via backend", data);
                    setToken(data.token);
                    setEmail("");
                    setPassword("");

                    // Navigate to Admin Dashboard
                    navigate("/admin-dashboard");
                } else {
                    setSignInStatus("error");
                    console.error("Access Denied: User is not an admin");
                    alert("You are not authorized to access the admin dashboard.");
                }
            } else {
                setSignInStatus("error");
                try {
                    const errorData = await response.json();
                    console.error("Sign In failed:", errorData.message || "Unknown error");
                } catch (err) {
                    console.error("Sign In Failed:", err);
                }
            }
        } catch (error) {
            setSignInStatus("error");
            console.error("Error during sign in:", error);
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
                    {signInStatus === "success" && (
                        <p style={{ color: "green" }}>Logged in Successfully</p>
                    )}
                    {signInStatus === "error" && (
                        <p style={{ color: "red" }}>Sign In Failed. Please try again.</p>
                    )}

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

export default AdminSignIn;
