import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./reset.css";
import { authService } from '../../services/api';
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match',
                confirmButtonColor: '#0d6efd'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await authService.resetPassword(token, password);
            
            if (response.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful!',
                    text: 'Your password has been reset successfully. You can now login with your new password.',
                    confirmButtonColor: '#0d6efd'
                }).then(() => {
                    window.location.href = '/login';
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

    if (!token) {
        return (
            <div className="reset-page-container">
                <div className="container text-center">
                    <h1 className="text-danger">Invalid Reset Link</h1>
                    <p>The password reset link is invalid or has expired.</p>
                    <Link to="/forget-password" className="btn btn-primary">
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-page-container">
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
                <h1 className="page-title">Reset Your Password</h1>
                <p className="page-subtitle">Enter your new password below.</p>
                
                <div className="reset-card">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn reset-btn"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 