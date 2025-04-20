import axios from 'axios';

// Create API instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests if available
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // Changed from 'adminToken' to 'token' to match AuthContext storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Auth state management
export const setAuthState = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

// Retry failed requests function
const retryRequest = async (requestFn, retries = 3, delay = 1000) => {
    try {
        return await requestFn();
    } catch (error) {
        if (retries <= 1) {
            throw error;
        }

        if (error.response && error.response.status === 401) {
            // If we get a 401, the token might be expired
            // In a real app, you'd refresh the token here or redirect to login
            throw error;
        }

        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry the request
        return retryRequest(requestFn, retries - 1, delay * 1.5);
    }
};

// API service with all endpoints
export const adminAPI = {
    // Auth
    login: (credentials) => api.post('/admin/auth/admin/login', credentials),
    getCurrentAdmin: () => retryRequest(() => api.get('/admin/auth/admin/me')),

    // Users
    getUsers: (params) => retryRequest(() => api.get('/admin/users', { params })),
    getUserById: (userId) => retryRequest(() => api.get(`/admin/users/${userId}`)),
    updateUser: (userId, userData) => retryRequest(() => api.put(`/admin/users/${userId}`, userData)),
    deleteUser: (userId) => retryRequest(() => api.delete(`/admin/users/${userId}`)),
    banUser: (userId) => retryRequest(() => api.post(`/admin/users/${userId}/ban`)),
    unbanUser: (userId) => retryRequest(() => api.post(`/admin/users/${userId}/unban`)),

    // Products
    getProducts: (params) => retryRequest(() => api.get('/admin/products', { params })),
    getAllProducts: (params) => retryRequest(() => api.get('/admin/products', { params })), // Added alias for backward compatibility
    getProductById: (productId) => retryRequest(() => api.get(`/admin/products/${productId}`)),
    updateProduct: (productId, productData) => retryRequest(() => api.put(`/admin/products/${productId}`, productData)),
    deleteProduct: (productId) => retryRequest(() => api.delete(`/admin/products/${productId}`)),

    // Categories
    getCategories: () => retryRequest(() => api.get('/admin/categories')),

    // Orders
    getAllOrders: (params) => retryRequest(() => api.get("/admin/orders", { params })),
    getOrderById: (orderId) => retryRequest(() => api.get(`/admin/orders/${orderId}`)),
    updateOrderStatus: (orderId, statusData) => retryRequest(() => api.put(`/admin/orders/${orderId}/status`, statusData)),

    // Seller applications
    getSellerApplications: (status = 'pending') => retryRequest(() => api.get("/admin/seller-applications", { params: { status } })),
    approveSellerApplication: (userId) => retryRequest(() => api.post(`/admin/seller-applications/${userId}/approve`)),
    rejectSellerApplication: (userId, reason) => retryRequest(() => api.post(`/admin/seller-applications/${userId}/reject`, reason)),

    // Dashboard analytics
    getDashboardAnalytics: () => retryRequest(() => api.get("/admin/analytics/dashboard")),
    getSalesAnalytics: (period = 'weekly') => retryRequest(() => api.get("/admin/analytics/sales", { params: { period } })),
    getUserAnalytics: () => retryRequest(() => api.get("/admin/analytics/users")),
};

export default api;