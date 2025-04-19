import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI, setAuthState, clearAuthState, getAuthState } from '../services/api';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                const authState = getAuthState();

                if (authState.isAuthenticated && authState.user) {
                    // Verify token validity by getting current user
                    try {
                        const response = await adminAPI.getCurrentAdmin();
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    } catch (tokenError) {
                        console.error("Invalid token or session expired:", tokenError);
                        clearAuthState();
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    // No valid auth state
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                // If the token is invalid, clear the auth state
                clearAuthState();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminAPI.login({
                email,
                password,
            });

            // Validate response
            if (!response?.data?.token || !response?.data?.user) {
                throw new Error('Invalid server response');
            }

            const { token, user } = response.data;

            // Ensure token is stored properly
            setAuthState(token, user);

            setUser(user);
            setIsAuthenticated(true);
            return { success: true, user };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            console.error('Admin login error:', { message: errorMessage });
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        clearAuthState();
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};