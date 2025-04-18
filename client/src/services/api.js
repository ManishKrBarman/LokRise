import axios from "axios";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to attach auth token to requests
const attachToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

// Auth APIs
export const authAPI = {
    register: (userData) => api.post("/auth/register", userData),
    login: (credentials) => api.post("/auth/login", credentials),
    verifyEmail: (data) => api.post("/auth/verify-email", data),
    registerSeller: (formData) => {
        attachToken();
        return api.post("/auth/seller/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

// Product APIs
export const productAPI = {
    getProducts: (params) => api.get("/products", { params }),
    getProductById: (id) => api.get(`/products/${id}`),
};

// Handle file uploads
export const uploadAPI = {
    uploadFile: (file, type) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        attachToken();
        return api.post("/uploads", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export default api;