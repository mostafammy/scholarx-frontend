import axios from 'axios';
import Cookies from 'js-cookie';

// Use environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cookie names with obscure names
const AUTH_TOKEN_KEY = 'sx_auth';
const USER_ROLE_KEY = 'sx_role';

// Cookie options
const cookieOptions = {
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Protect against CSRF
    path: '/', // Cookie is available for all paths
    expires: 7 // 7 days
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Remove all auth-related cookies
            Cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
            Cookies.remove(USER_ROLE_KEY, cookieOptions);
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        
        if (response.data.status === 'success') {
            // Set token in cookie with secure options
            Cookies.set(AUTH_TOKEN_KEY, response.data.data.token, cookieOptions);
            // Set user role if available
            if (response.data.data.user?.role) {
                Cookies.set(USER_ROLE_KEY, response.data.data.user.role, cookieOptions);
            }
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/users/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/users/reset-password', {
            token,
            newPassword
        });
        return response.data;
    },

    // Google authentication
    initiateGoogleLogin: () => {
        window.location.href = `${API_URL}/users/google`;
    },

    handleGoogleCallback: async (token) => {
        try {
            if (token) {
                Cookies.set(AUTH_TOKEN_KEY, token, cookieOptions);
                // Get user data to set role
                const userResponse = await api.get('/users/profile');
                if (userResponse.data.data?.user?.role) {
                    Cookies.set(USER_ROLE_KEY, userResponse.data.data.user.role, cookieOptions);
                }
                return userResponse;
            }
        } catch (error) {
            console.error('Error handling Google callback:', error);
            throw error;
        }
    },

    logout: () => {
        // Remove all auth-related cookies with secure options
        Cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
        Cookies.remove(USER_ROLE_KEY, cookieOptions);
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/profile');
            // Update role cookie if available
            if (response.data.data?.user?.role) {
                Cookies.set(USER_ROLE_KEY, response.data.data.user.role, cookieOptions);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateProfile: async (formData) => {
        // If formData is FormData, use axios directly to avoid default headers
        if (formData instanceof FormData) {
            const response = await axios.patch(
                `${API_URL}/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(AUTH_TOKEN_KEY)}`
                        // Do NOT set 'Content-Type' here!
                    },
                }
            );
   
            
            return response.data;
        } else {
            // fallback for non-FormData
            const response = await api.patch('/users/profile', formData);
            
            return response.data;
        }
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/users/update-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },
    isAuthenticated: () => {
        return !!Cookies.get(AUTH_TOKEN_KEY);
    },

    createPayment: async (courseId, paymentMethod = 'CARD') => {
        try {
            const response = await axios.post(
                `${API_URL}/payments/create/${courseId}`,
                { paymentMethod },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get(AUTH_TOKEN_KEY)}`,
                    },
                }
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    getPaymentMethods: async () => {
        try {
            const response = await axios.get(`${API_URL}/payments/methods`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    verifyEmail: async (token) => {
        return await axios.get(`${API_URL}/users/verify-email?token=${token}`);
    },

 
};

export const programService = {
    // Ambassador Program
    submitAmbassadorApplication: async (data) => {
        const response = await api.post('/programs/ambassador/apply', data);
        return response.data;
    },

    // Mentorship Program
    submitMentorshipRequest: async (data) => {
        const response = await api.post('/programs/mentorship/request', data);
        return response.data;
    },

    // Get application status
    getApplicationStatus: async (id) => {
        const response = await api.get(`/programs/status/${id}`);
        return response.data;
    },

    // Get all applications for current user
    getMyApplications: async () => {
        const response = await api.get('/programs/my-applications');
        return response.data;
    }
};

export default api; 