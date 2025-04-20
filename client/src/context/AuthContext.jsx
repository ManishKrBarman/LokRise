import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, BASE_URL } from '../services/api';

// Helper to check if running in mobile browser
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Helper function to get profile image URL
const getProfileImageUrl = (userId) => {
    if (!userId) return null;
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    // Remove any trailing slashes from the API URL
    const baseUrl = apiUrl.replace(/\/$/, '');
    return `${baseUrl}/auth/profile-image/${userId}?t=${Date.now()}`;
};

// Local implementation of auth state management functions to avoid import issues
const clearAuthState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

const setAuthState = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

const getAuthState = () => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (!token || !userJson) {
        return { isAuthenticated: false, user: null };
    }

    try {
        const user = JSON.parse(userJson);
        return { isAuthenticated: true, user };
    } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return { isAuthenticated: false, user: null };
    }
};

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
                        const response = await authAPI.getCurrentUser();
                        const currentUser = response.data.user;

                        // Update user with proper image URL
                        setUser({
                            ...currentUser,
                            profileImage: currentUser._id ? getProfileImageUrl(currentUser._id) : null
                        });
                        setIsAuthenticated(true);
                    } catch (tokenError) {
                        console.error("Invalid token or session expired:", tokenError);
                        clearAuthState();
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                clearAuthState();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Get current user function
    const getCurrentUser = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            const currentUser = response.data.user;

            // Update user in state
            const userWithImage = {
                ...currentUser,
                profileImage: currentUser._id ? getProfileImageUrl(currentUser._id) : null
            };

            setUser(userWithImage);

            // Update stored user data
            const authState = getAuthState();
            if (authState.isAuthenticated) {
                setAuthState(localStorage.getItem("token"), userWithImage);
            }

            return userWithImage;
        } catch (error) {
            console.error("Error getting current user:", error);

            // Handle authentication errors
            if (error.response?.status === 401) {
                clearAuthState();
                setUser(null);
                setIsAuthenticated(false);
            }

            throw error;
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const deviceInfo = {
                isMobile: isMobileDevice(),
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };

            console.log('Login attempt:', { email, deviceInfo });
            const response = await authAPI.login({
                email,
                password,
                deviceInfo
            });

            if (!response?.data?.token || !response?.data?.user) {
                throw new Error('Invalid server response');
            }

            const { token, user: userData } = response.data;

            // Add profile image URL to user data
            const userWithImage = {
                ...userData,
                profileImage: userData.id ? getProfileImageUrl(userData.id) : null
            };

            setAuthState(token, userWithImage);
            setUser(userWithImage);
            setIsAuthenticated(true);
            return { success: true, user: userWithImage };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.register(userData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.message || "Registration failed");
            return { success: false, error: error.response?.data?.message || "Registration failed" };
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

    // Verify email function
    const verifyEmail = async (email, verificationCode) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.verifyEmail({ email, verificationCode });
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Email verification error:", error);
            setError(error.response?.data?.message || "Verification failed");
            return { success: false, error: error.response?.data?.message || "Verification failed" };
        } finally {
            setLoading(false);
        }
    };

    // Update profile function
    const updateProfile = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.updateProfile(formData);
            const updatedUser = response.data.user;

            // Update local user state with proper image URL
            setUser(prev => ({
                ...prev,
                ...updatedUser,
                profileImage: updatedUser.id ? getProfileImageUrl(updatedUser.id) : null
            }));

            // Update stored user data
            const authState = getAuthState();
            if (authState.isAuthenticated) {
                setAuthState(localStorage.getItem("token"), {
                    ...authState.user,
                    ...updatedUser,
                    profileImage: updatedUser.id ? getProfileImageUrl(updatedUser.id) : null
                });
            }

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error("Profile update error:", error);
            setError(error.response?.data?.message || "Profile update failed");
            return { success: false, error: error.response?.data?.message || "Profile update failed" };
        } finally {
            setLoading(false);
        }
    };

    // Forgot password function
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.forgotPassword(email);
            return { success: true, data: response.data };
        } catch (error) {
            console.error("Password reset request error:", error);
            setError(error.response?.data?.message || "Password reset request failed");
            return { success: false, error: error.response?.data?.message || "Password reset request failed" };
        } finally {
            setLoading(false);
        }
    };

    // Reset password function
    const resetPassword = async (resetToken, newPassword, email = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.resetPassword({ resetToken, newPassword });

            // If a token is returned and email is provided, auto-login
            if (response.data.token && email) {
                await login(email, newPassword);
            }

            return { success: true, data: response.data };
        } catch (error) {
            console.error("Password reset error:", error);
            setError(error.response?.data?.message || "Password reset failed");
            return { success: false, error: error.response?.data?.message || "Password reset failed" };
        } finally {
            setLoading(false);
        }
    };

    // Register as seller function
    const registerAsSeller = async (sellerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authAPI.registerSeller(sellerData);

            // Update user data and token if successful
            if (response.data.token) {
                // Update authentication state with new token and updated user data
                setAuthState(response.data.token, response.data.user);
                setUser(response.data.user);
            }

            return { success: true, data: response.data };
        } catch (error) {
            console.error("Seller registration error:", error);
            setError(error.response?.data?.message || "Seller registration failed");
            return { success: false, error: error.response?.data?.message || "Seller registration failed" };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        verifyEmail,
        updateProfile,
        forgotPassword,
        resetPassword,
        registerAsSeller,
        getCurrentUser,
        getProfileImageUrl // Export the helper function
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};