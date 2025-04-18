import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Create wishlist context
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    // Initialize wishlist when authentication state changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            // Clear wishlist when logged out
            setWishlistItems([]);
        }
    }, [isAuthenticated]);

    // Fetch wishlist from API
    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        
        setLoading(true);
        try {
            const response = await userAPI.getWishlist();
            setWishlistItems(response.data.items || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError(err.response?.data?.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Add item to wishlist
    const addToWishlist = async (productId) => {
        if (!isAuthenticated) {
            return { success: false, error: 'Please login to add items to your wishlist' };
        }

        setLoading(true);
        try {
            const response = await userAPI.addToWishlist(productId);
            setWishlistItems(response.data.items || []);
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            const errorMessage = err.response?.data?.message || 'Failed to add item to wishlist';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Remove item from wishlist
    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) {
            return { success: false, error: 'Please login to manage your wishlist' };
        }

        setLoading(true);
        try {
            const response = await userAPI.removeFromWishlist(productId);
            setWishlistItems(response.data.items || []);
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            const errorMessage = err.response?.data?.message || 'Failed to remove item from wishlist';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Check if an item is in the wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product._id === productId);
    };

    const value = {
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use wishlist context
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};