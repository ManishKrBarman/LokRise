import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

// Create cart context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    // Initialize cart from localStorage or API
    useEffect(() => {
        const initializeCart = async () => {
            if (isAuthenticated) {
                // If user is authenticated, fetch cart from API
                await fetchCartFromAPI();
            } else {
                // Otherwise load from localStorage
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    try {
                        setCartItems(JSON.parse(localCart));
                    } catch (err) {
                        console.error('Error parsing local cart:', err);
                        localStorage.removeItem('cart');
                        setCartItems([]);
                    }
                }
            }
        };

        initializeCart();
    }, [isAuthenticated]);

    // Save cart to localStorage whenever it changes (for guests)
    useEffect(() => {
        if (!isAuthenticated && cartItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    // Fetch cart from API
    const fetchCartFromAPI = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getCart();
            setCartItems(response.data.items || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.response?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (product, quantity = 1) => {
        setLoading(true);
        try {
            if (isAuthenticated) {
                // Add to server cart if authenticated
                const response = await userAPI.addToCart(product._id, quantity);
                setCartItems(response.data.items);
            } else {
                // Check if the product is already in the local cart
                const existingItem = cartItems.find(item => item.product._id === product._id);
                
                if (existingItem) {
                    // If the item exists, update the quantity
                    setCartItems(cartItems.map(item => 
                        item.product._id === product._id 
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ));
                } else {
                    // If the item doesn't exist, add it as a new item
                    setCartItems([...cartItems, { 
                        product: {
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            images: product.images
                        }, 
                        quantity 
                    }]);
                }
            }
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.response?.data?.message || 'Failed to add item to cart');
            return { success: false, error: err.response?.data?.message || 'Failed to add item to cart' };
        } finally {
            setLoading(false);
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        setLoading(true);
        try {
            if (isAuthenticated) {
                // Update on server if authenticated
                const response = await userAPI.updateCartItem(productId, quantity);
                setCartItems(response.data.items);
            } else {
                // Update local cart if guest
                setCartItems(cartItems.map(item => 
                    item.product._id === productId 
                        ? { ...item, quantity }
                        : item
                ));
            }
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError(err.response?.data?.message || 'Failed to update cart');
            return { success: false, error: err.response?.data?.message || 'Failed to update cart' };
        } finally {
            setLoading(false);
        }
    };

    // Remove item from cart
    const removeFromCart = async (productId) => {
        setLoading(true);
        try {
            if (isAuthenticated) {
                // Remove from server if authenticated
                const response = await userAPI.removeFromCart(productId);
                setCartItems(response.data.items);
            } else {
                // Remove from local cart if guest
                setCartItems(cartItems.filter(item => item.product._id !== productId));
            }
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError(err.response?.data?.message || 'Failed to remove item from cart');
            return { success: false, error: err.response?.data?.message || 'Failed to remove item from cart' };
        } finally {
            setLoading(false);
        }
    };

    // Clear cart
    const clearCart = async () => {
        setLoading(true);
        try {
            if (isAuthenticated) {
                // Clear server cart if authenticated
                await userAPI.clearCart();
            }
            // Clear local cart state
            setCartItems([]);
            // Clear localStorage cart
            localStorage.removeItem('cart');
            setError(null);
            return { success: true };
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(err.response?.data?.message || 'Failed to clear cart');
            return { success: false, error: err.response?.data?.message || 'Failed to clear cart' };
        } finally {
            setLoading(false);
        }
    };

    // Migrate guest cart to user cart upon login
    const migrateGuestCart = async () => {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
            try {
                const parsedCart = JSON.parse(localCart);
                if (parsedCart.length > 0) {
                    setLoading(true);
                    
                    // Add each item to the server cart
                    for (const item of parsedCart) {
                        await userAPI.addToCart(item.product._id, item.quantity);
                    }
                    
                    // Fetch the updated cart from server
                    await fetchCartFromAPI();
                    
                    // Clear local cart
                    localStorage.removeItem('cart');
                }
            } catch (err) {
                console.error('Error migrating guest cart:', err);
                setError(err.message || 'Failed to migrate cart');
            } finally {
                setLoading(false);
            }
        }
    };

    // Calculate cart totals
    const getCartTotals = () => {
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        
        return {
            itemCount,
            subtotal,
            tax: subtotal * 0.18, // Assuming 18% tax
            shipping: subtotal > 0 ? (subtotal > 1000 ? 0 : 100) : 0, // Free shipping over ₹1000
            total: subtotal + (subtotal * 0.18) + (subtotal > 0 ? (subtotal > 1000 ? 0 : 100) : 0)
        };
    };

    const value = {
        cartItems,
        loading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        migrateGuestCart,
        getCartTotals
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};