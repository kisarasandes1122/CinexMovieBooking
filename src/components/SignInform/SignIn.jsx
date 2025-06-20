import React, { useState } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './SignIn.css';
import * as jwt_decode from 'jwt-decode';
import { apiService } from '../../utils/axios';
import { handleApiError } from '../../utils/errorHandler';
import { Mail, Lock, Eye, EyeOff, LogIn, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const SignIn = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [signInStatus, setSignInStatus] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignInStatus("submitting");

        try {
            const response = await apiService.auth.login({ email, password });
            
            if (response.data) {
                const data = response.data;
                setSignInStatus("success");
                onLogin(data.token);

                try {
                    const decodedToken = jwt_decode.jwtDecode(data.token);
                    localStorage.setItem('userId', decodedToken.userId);
                    
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                } catch(error) {
                    console.error('Error decoding token', error);
                }

                setEmail("");
                setPassword("");
                
                // Navigate to the protected route or home
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            setSignInStatus('error');
            const errorMessage = handleApiError(error, 'Sign in failed');
            console.error('Sign In failed:', errorMessage);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="si-page">
            <div className="si-container">
                <div className="si-header">
                    <div className="si-logo">
                        <div className="si-logo-icon">
                            <User size={32} />
                        </div>
                        <h1 className="si-brand">CINEX</h1>
                        <span className="si-brand-subtitle">Cinema</span>
                    </div>
                    <div className="si-welcome">
                        <h2 className="si-title">Welcome Back</h2>
                        <p className="si-subtitle">Sign in to your account to continue</p>
                    </div>
                </div>

                <form className="si-form" onSubmit={handleSubmit}>
                    <div className="si-input-group">
                        <div className="si-input-wrapper">
                            <Mail className="si-input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="si-input"
                                disabled={signInStatus === "submitting"}
                            />
                        </div>
                    </div>

                    <div className="si-input-group">
                        <div className="si-input-wrapper">
                            <Lock className="si-input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="si-input"
                                disabled={signInStatus === "submitting"}
                            />
                            <button
                                type="button"
                                className="si-password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="si-options">
                        <label className="si-checkbox">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="si-checkbox-mark"></span>
                            <span className="si-checkbox-text">Remember me</span>
                        </label>
                        <Link to="/ChangePasswordForm" className="si-forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Status Messages */}
                    {signInStatus === "submitting" && (
                        <div className="si-status si-status-loading">
                            <Loader className="si-status-icon si-spinning" size={16} />
                            <span>Signing you in...</span>
                        </div>
                    )}
                    
                    {signInStatus === "success" && (
                        <div className="si-status si-status-success">
                            <CheckCircle className="si-status-icon" size={16} />
                            <span>Login successful! Redirecting...</span>
                        </div>
                    )}
                    
                    {signInStatus === "error" && (
                        <div className="si-status si-status-error">
                            <AlertCircle className="si-status-icon" size={16} />
                            <span>Sign in failed. Please check your credentials and try again.</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="si-submit-btn"
                        disabled={signInStatus === "submitting"}
                    >
                        {signInStatus === "submitting" ? (
                            <>
                                <Loader className="si-btn-icon si-spinning" size={18} />
                                Signing In...
                            </>
                        ) : (
                            <>
                                <LogIn className="si-btn-icon" size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="si-footer">
                    <div className="si-divider">
                        <span>Don't have an account?</span>
                    </div>
                    <Link to="/RegistrationForm" className="si-register-link">
                        Create Account
                    </Link>
                    
                    <div className="si-help-text">
                        <p>Need help? Contact our support team</p>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="si-background">
                <div className="si-bg-circle si-bg-circle-1"></div>
                <div className="si-bg-circle si-bg-circle-2"></div>
                <div className="si-bg-circle si-bg-circle-3"></div>
            </div>
        </div>
    );
};

export default SignIn;