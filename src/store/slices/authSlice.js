import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';
import Cookies from 'js-cookie';

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

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            // Store user role in cookie with secure options
            Cookies.set(USER_ROLE_KEY, response.data.user.role, cookieOptions);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.data?.message);
        }
    }
);

export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async (token, { rejectWithValue }) => {
        try {
            const response = await authService.handleGoogleCallback(token);
            if (response.data?.user?.role) {
                Cookies.set(USER_ROLE_KEY, response.data.user.role, cookieOptions);
            }
            return { token };
        } catch (error) {
            return rejectWithValue(error.message || 'Google login failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            Cookies.set(USER_ROLE_KEY, response.data.user.role, cookieOptions);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to get user data');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(formData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

const initialState = {
    user: null,
    token: Cookies.get(AUTH_TOKEN_KEY) || null,
    isAuthenticated: !!Cookies.get(AUTH_TOKEN_KEY),
    isAdmin: Cookies.get(USER_ROLE_KEY) === 'admin',
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            // Remove cookies with secure options
            Cookies.remove(AUTH_TOKEN_KEY, cookieOptions);
            Cookies.remove(USER_ROLE_KEY, cookieOptions);
        },
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAdmin = action.payload?.role === 'admin';
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAdmin = action.payload.user.role === 'admin';
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Google Login
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.isAdmin = Cookies.get(USER_ROLE_KEY) === 'admin';
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAdmin = action.payload.user.role === 'admin';
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer; 