import axios from "axios";

// API configuration
const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    throw new Error('VITE_API_URL environment variable is not defined');
};

export const BASE_URL = getBaseUrl();

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false // Allow cross-origin requests
});

// Add this after the existing axios instance creation
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function for handling retries
const retryRequest = async (apiCall, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === retries - 1) throw error; // Last retry failed

            // Only retry on network errors or 5xx server errors
            if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
                continue;
            }
            throw error; // Don't retry on other errors
        }
    }
};

// Request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle token expiration
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (userData) => retryRequest(() => api.post("/auth/register", userData)),
    login: (credentials) => retryRequest(() => api.post("/auth/login", {
        ...credentials,
        deviceInfo: {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        }
    })),
    verifyEmail: (data) => retryRequest(() => api.post("/auth/verify-email", data)),
    forgotPassword: (email) => retryRequest(() => api.post("/auth/forgot-password", { email })),
    resetPassword: (data) => retryRequest(() => api.post("/auth/reset-password", data)),
    getCurrentUser: () => retryRequest(() => api.get("/auth/me")),
    updateProfile: (userData) => retryRequest(() => api.put("/auth/update-profile", userData)),
    registerSeller: (formData) => {
        // Log data being sent to server for debugging
        console.log("Seller data being sent to server:", formData);

        // Send as JSON data instead of FormData
        return api.post("/auth/seller/register", formData);
    },
};

// Product APIs
export const productAPI = {
    // Public endpoints
    getProducts: (params) => api.get("/products", { params }),
    getProductById: (id) => api.get(`/products/${id}`),
    getFeaturedProducts: () => api.get("/products/featured"),
    getRelatedProducts: (id) => api.get(`/products/${id}/related`),

    // Protected endpoints - require authentication
    createProduct: (productData) => api.post("/products", productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    getSellerProducts: (params) => api.get("/products/seller/products", { params }),
    getProductStats: (id) => api.get(`/products/${id}/stats`),
};

// Order APIs
export const orderAPI = {
    // Buyer endpoints
    placeOrder: (orderData) => api.post("/orders", orderData),
    getBuyerOrders: (params) => api.get("/orders/my-orders", { params }),
    getOrderById: (id) => api.get(`/orders/${id}`),
    cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),

    // Seller endpoints
    getSellerOrders: (params) => api.get("/orders/seller-orders", { params }),
    updateOrderStatus: (id, status, description) =>
        api.post(`/orders/${id}/update-status`, { status, description }),

    // Receipt generation
    generateReceipt: (id) => api.get(`/orders/${id}/receipt`),

    // Admin endpoints
    getAllOrders: (params) => api.get("/orders", { params }),
};

// Payment APIs
export const paymentAPI = {
    // UPI payment
    initiateUpiPayment: (data) => api.post("/payment/upi/initiate", data),
    verifyUpiPayment: (data) => api.post("/payment/upi/verify", data),

    // Card payment
    processCardPayment: (data) => api.post("/payment/card/process", data),

    // COD
    processCOD: (data) => api.post("/payment/cod/process", data),

    // Receipt
    generatePaymentReceipt: (orderId) => api.get(`/payment/receipt/${orderId}`),

    // Refund (seller only)
    processRefund: (data) => api.post("/payment/refund", data),
};

// User features APIs
export const userAPI = {
    // Cart operations
    getCart: () => api.get("/cart"),
    addToCart: (productId, quantity) => api.post("/cart", { productId, quantity }),
    updateCartItem: (productId, quantity) => api.put("/cart", { productId, quantity }),
    removeFromCart: (productId) => api.delete(`/cart/${productId}`),
    clearCart: () => api.delete("/cart"),

    // Wishlist operations
    getWishlist: () => api.get("/wishlist"),
    addToWishlist: (productId) => api.post("/wishlist", { productId }),
    removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),

    // Reviews and ratings
    addReview: (productId, reviewData) => api.post(`/reviews/${productId}`, reviewData),
    getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
    getUserReviews: () => api.get("/reviews/user"),
};

// Seller dashboard APIs
export const sellerAPI = {
    // Dashboard stats
    getSellerStats: () => api.get("/seller/stats"),
    getRevenueData: (params) => api.get("/seller/revenue", { params }),
    getPopularProducts: () => api.get("/seller/products/popular"),
    getRecentOrders: () => api.get("/seller/orders/recent"),

    // Seller profile
    getSellerProfile: () => api.get("/seller/profile"),
    updateSellerProfile: (data) => api.put("/seller/profile", data),
    updateBusinessDetails: (data) => api.put("/seller/business", data),
    updateBankDetails: (data) => api.put("/seller/bank", data),
};

// Handle file uploads
export const uploadAPI = {
    uploadFile: (file, type) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        return api.post("/uploads", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    uploadProductImage: (productId, file) => {
        const formData = new FormData();
        formData.append("image", file);
        return api.post(`/uploads/product/${productId}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    uploadProfileImage: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return api.post("/uploads/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
};

// User state management
export const getAuthState = () => {
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

export const setAuthState = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthState = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export default api;