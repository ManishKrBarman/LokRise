import { sellerAPI, productAPI, orderAPI } from './api';

/**
 * Seller Service - Handles seller dashboard functionality
 */
export const SellerService = {
    /**
     * Get seller dashboard statistics
     * @returns {Promise} Promise with seller stats
     */
    getSellerStats: async () => {
        try {
            const response = await sellerAPI.getSellerStats();
            return {
                success: true,
                stats: response.data
            };
        } catch (error) {
            console.error("Failed to fetch seller stats:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load seller statistics"
            };
        }
    },

    /**
     * Get seller revenue data for charts
     * @param {Object} params - Filtering parameters (timeRange, startDate, endDate)
     * @returns {Promise} Promise with revenue data
     */
    getRevenueData: async (params = {}) => {
        try {
            const response = await sellerAPI.getRevenueData(params);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error("Failed to fetch revenue data:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load revenue data"
            };
        }
    },

    /**
     * Get seller's popular products
     * @returns {Promise} Promise with popular products data
     */
    getPopularProducts: async () => {
        try {
            const response = await sellerAPI.getPopularProducts();
            return {
                success: true,
                products: response.data
            };
        } catch (error) {
            console.error("Failed to fetch popular products:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load popular products"
            };
        }
    },

    /**
     * Get seller's recent orders
     * @returns {Promise} Promise with recent orders
     */
    getRecentOrders: async () => {
        try {
            const response = await sellerAPI.getRecentOrders();
            return {
                success: true,
                orders: response.data
            };
        } catch (error) {
            console.error("Failed to fetch recent orders:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load recent orders"
            };
        }
    },

    /**
     * Get seller's products with pagination and filtering
     * @param {Object} params - Filtering and pagination params
     * @returns {Promise} Promise with seller products
     */
    getSellerProducts: async (params = {}) => {
        try {
            const response = await productAPI.getSellerProducts(params);
            return {
                success: true,
                ...response.data
            };
        } catch (error) {
            console.error("Failed to fetch seller products:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load seller products"
            };
        }
    },

    /**
     * Create a new product
     * @param {Object} productData - Product details
     * @returns {Promise} Promise with created product
     */
    createProduct: async (productData) => {
        try {
            const response = await productAPI.createProduct(productData);
            return {
                success: true,
                product: response.data.product
            };
        } catch (error) {
            console.error("Failed to create product:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to create product"
            };
        }
    },

    /**
     * Update an existing product
     * @param {String} productId - ID of product to update
     * @param {Object} productData - Updated product details
     * @returns {Promise} Promise with updated product
     */
    updateProduct: async (productId, productData) => {
        try {
            const response = await productAPI.updateProduct(productId, productData);
            return {
                success: true,
                product: response.data.product
            };
        } catch (error) {
            console.error("Failed to update product:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to update product"
            };
        }
    },

    /**
     * Delete a product
     * @param {String} productId - ID of product to delete
     * @returns {Promise} Promise with deletion result
     */
    deleteProduct: async (productId) => {
        try {
            const response = await productAPI.deleteProduct(productId);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error("Failed to delete product:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to delete product"
            };
        }
    },

    /**
     * Get seller's orders with filtering and pagination
     * @param {Object} params - Filtering and pagination params
     * @returns {Promise} Promise with seller orders
     */
    getSellerOrders: async (params = {}) => {
        try {
            const response = await orderAPI.getSellerOrders(params);
            return {
                success: true,
                ...response.data
            };
        } catch (error) {
            console.error("Failed to fetch seller orders:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load seller orders"
            };
        }
    },

    /**
     * Update order status
     * @param {String} orderId - Order ID
     * @param {String} status - New status
     * @param {String} description - Optional status update description
     * @returns {Promise} Promise with update result
     */
    updateOrderStatus: async (orderId, status, description = "") => {
        try {
            const response = await orderAPI.updateOrderStatus(orderId, status, description);
            return {
                success: true,
                ...response.data
            };
        } catch (error) {
            console.error("Failed to update order status:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to update order status"
            };
        }
    },

    /**
     * Generate receipt for an order
     * @param {String} orderId - Order ID
     * @returns {Promise} Promise with receipt data
     */
    generateOrderReceipt: async (orderId) => {
        try {
            const response = await orderAPI.generateReceipt(orderId);
            return {
                success: true,
                receipt: response.data
            };
        } catch (error) {
            console.error("Failed to generate receipt:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to generate receipt"
            };
        }
    },

    /**
     * Get seller profile data
     * @returns {Promise} Promise with seller profile data
     */
    getSellerProfile: async () => {
        try {
            const response = await sellerAPI.getSellerProfile();
            return {
                success: true,
                profile: response.data
            };
        } catch (error) {
            console.error("Failed to fetch seller profile:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to load seller profile"
            };
        }
    },

    /**
     * Update seller profile
     * @param {Object} profileData - Updated profile data
     * @returns {Promise} Promise with updated profile
     */
    updateSellerProfile: async (profileData) => {
        try {
            const response = await sellerAPI.updateSellerProfile(profileData);
            return {
                success: true,
                profile: response.data
            };
        } catch (error) {
            console.error("Failed to update seller profile:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to update seller profile"
            };
        }
    },

    /**
     * Update business details
     * @param {Object} businessData - Updated business data
     * @returns {Promise} Promise with update result
     */
    updateBusinessDetails: async (businessData) => {
        try {
            const response = await sellerAPI.updateBusinessDetails(businessData);
            return {
                success: true,
                business: response.data
            };
        } catch (error) {
            console.error("Failed to update business details:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to update business details"
            };
        }
    },

    /**
     * Update bank details
     * @param {Object} bankData - Updated bank data
     * @returns {Promise} Promise with update result
     */
    updateBankDetails: async (bankData) => {
        try {
            const response = await sellerAPI.updateBankDetails(bankData);
            return {
                success: true,
                bank: response.data
            };
        } catch (error) {
            console.error("Failed to update bank details:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to update bank details"
            };
        }
    },
};

export default SellerService;