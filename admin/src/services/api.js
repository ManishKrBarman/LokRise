import axios from 'axios';

// Create base API instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/', // Use environment variable or production URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for authorization headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized errors (e.g., clear auth state, redirect to login)
            clearAuthState();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Retry request utility function
const retryRequest = async (requestFn, retries = 3, delay = 1000) => {
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await requestFn();
        } catch (err) {
            lastError = err;

            // Don't retry for these status codes
            if (err.response && [400, 401, 403, 404].includes(err.response.status)) {
                throw err;
            }

            // Wait before retrying
            if (attempt < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
};

// Admin APIs
export const adminAPI = {
    login: (credentials) => retryRequest(() => api.post("/admin/auth/admin/login", credentials)),
    getCurrentAdmin: () => retryRequest(() => api.get("/admin/auth/admin/me")),

    // User management
    getAllUsers: (params) => retryRequest(() => api.get("/admin/users", { params })),
    getUserById: (userId) => retryRequest(() => api.get(`/admin/users/${userId}`)),
    updateUser: (userId, userData) => retryRequest(() => api.put(`/admin/users/${userId}`, userData)),
    deleteUser: (userId) => retryRequest(() => api.delete(`/admin/users/${userId}`)),
    banUser: (userId) => retryRequest(() => api.post(`/admin/users/${userId}/ban`)),
    unbanUser: (userId) => retryRequest(() => api.post(`/admin/users/${userId}/unban`)),

    // Product management
    getAllProducts: (params) => retryRequest(() => api.get("/admin/products", { params })),
    getProductById: (productId) => retryRequest(() => api.get(`/admin/products/${productId}`)),
    updateProduct: (productId, productData) => retryRequest(() => api.put(`/admin/products/${productId}`, productData)),
    deleteProduct: (productId) => retryRequest(() => api.delete(`/admin/products/${productId}`)),

    // Order management
    getAllOrders: (params) => retryRequest(() => api.get("/admin/orders", { params })),
    getOrderById: (orderId) => retryRequest(() => api.get(`/admin/orders/${orderId}`)),
    updateOrderStatus: (orderId, status) => retryRequest(() => api.put(`/admin/orders/${orderId}/status`, { status })),

    // Seller applications
    getSellerApplications: (params) => retryRequest(() => api.get("/admin/seller-applications", { params })),
    approveSellerApplication: (userId) => retryRequest(() => api.post(`/admin/seller-applications/${userId}/approve`)),
    rejectSellerApplication: (userId, reason) => retryRequest(() =>
        api.post(`/admin/seller-applications/${userId}/reject`, { reason })),

    // Analytics
    getDashboardStats: () => retryRequest(() => api.get("/admin/analytics/dashboard")),
    getSalesReport: (params) => retryRequest(() => api.get("/admin/analytics/sales", { params })),
    getUserStats: (params) => retryRequest(() => api.get("/admin/analytics/users", { params })),
    getProductStats: (params) => retryRequest(() => api.get("/admin/analytics/products", { params })),
};

// Auth state management
export const getAuthState = () => {
    const token = localStorage.getItem("admin_token");
    const userJson = localStorage.getItem("admin_user");

    if (!token || !userJson) {
        return { isAuthenticated: false, user: null };
    }

    try {
        const user = JSON.parse(userJson);
        return { isAuthenticated: true, user };
    } catch (error) {
        console.error("Error parsing admin user data:", error);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        return { isAuthenticated: false, user: null };
    }
};

export const setAuthState = (token, user) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
};

export const clearAuthState = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
};

export default api;