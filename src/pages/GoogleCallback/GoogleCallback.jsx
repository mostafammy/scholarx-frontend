import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../../store/slices/authSlice';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                const error = params.get('error');

                if (error) {
                    throw new Error(`Authentication error: ${error}`);
                }

                if (!token) {
                    throw new Error('No token received from Google authentication');
                }

                await dispatch(googleLogin(token));
                
                await Swal.fire({
                    title: 'Success!',
                    text: 'Google login successful!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });
                navigate('/');
            } catch (error) {
                console.error('Google callback error:', error);
                await Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Google login failed. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                navigate('/login');
            }
        };

        handleGoogleCallback();
    }, [dispatch, location, navigate]);

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Processing Google login...</p>
        </div>
    );
};

export default GoogleCallback; 