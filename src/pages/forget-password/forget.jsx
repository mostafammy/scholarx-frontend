import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./forget.css";
import { authService } from '../../services/api';
import Swal from 'sweetalert2';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            
            if (response.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Reset Link Sent!',
                    text: 'Please check your email for password reset instructions.',
                    confirmButtonColor: '#0d6efd'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#0d6efd'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forget-page-container">
            <div className="logo-container">
                <Link to="/">
                    <img 
                        src="/ScholarX-Logo-Icon-White-Blue-BG_ScholarX.svg" 
                        className="scholar-logo"
                        alt="ScholarX Logo" 
                    />
                    <span className="logo-text">ScholarX</span>
                </Link>
            </div>
            
            <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
                <h1 className="page-title">Forgot Your Password?</h1>
                <p className="page-subtitle">No worries! Enter your email and we'll send you a link to reset it.</p>
                
                <div className="forgot-card">
                    <h5 className="text-center mb-4">Enter your email</h5>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="d-grid mt-3">
                            <button 
                                type="submit" 
                                className="btn reset-btn"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center">
                        Remember your password? <Link to="/login" className="login-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
