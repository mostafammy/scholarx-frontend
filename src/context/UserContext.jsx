import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated on initial load
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const response = await authService.getCurrentUser();
                    if (response.status === 'success') {
                        setUser(response.data.user);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        authService.logout();
    };

    const refreshUser = async () => {
        setLoading(true);
        try {
            if (authService.isAuthenticated()) {
                const response = await authService.getCurrentUser();
                if (response.status === 'success') {
                    setUser(response.data.user);
                }
                return response; // Return the backend response
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 