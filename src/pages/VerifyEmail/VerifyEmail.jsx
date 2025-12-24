import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/api';
import Swal from 'sweetalert2';
// import './VerifyEmail.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {

            try {
                const token = searchParams.get('token');
                if (!token) {
                    throw new Error('No verification token found');
                }

                const response = await authService.verifyEmail(token);
                
                if (response.data.status === 'success') {
                    await Swal.fire({
                        // title: 'Success!',
                        text: 'Email verified successfully! You can now login.',
                        icon: 'success',
                        // confirmButtonText: 'Go to Login'
                        toast: true,
                        position: 'top-right',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        // title: 'Email verified successfully! You can now login'
                    });
                    navigate('/login');
                } else {
                    throw new Error(response.data.data.message || 'Verification failed');
                }
            } catch (error) {
                
                await Swal.fire({
                    title: 'Error!',
                    text: error.response.data.data.message|| 'Email verification failed',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                });
                // navigate('/login');
            } finally {
                setVerifying(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="verify-email-container">
            <div className="verify-email-content">
                <h1>Email Verification</h1>
                {verifying ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Verifying your email...</p>
                    </div>
                ) : (
                    <p>Redirecting to login page...</p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail; 

