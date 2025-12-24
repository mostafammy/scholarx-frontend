import React, { useState } from 'react';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose, userEmail }) => {
    const [email, setEmail] = useState(userEmail || '');
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
                    confirmButtonColor: '#3399cc'
                });
                onClose(); // Close modal after success
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#3399cc'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="forgot-password-modal-overlay">
            <div className="forgot-password-modal">
                <div className="modal-header">
                    <h3>Forgot Your Password?</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                
                <div className="modal-body">
                    <p className="modal-subtitle">
                        No worries! Enter your email and we'll send you a link to reset it.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
