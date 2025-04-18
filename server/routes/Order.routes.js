import express from 'express';
import {
    placeOrder,
    getOrders,
    getOrderById,
    getBuyerOrders,
    getSellerOrders,
    updateOrderStatus,
    generateOrderReceipt,
    cancelOrder
} from '../controllers/Order.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const OrderRoutes = express.Router();

// Protected routes - require authentication
OrderRoutes.post('/', authMiddleware, placeOrder);
OrderRoutes.get('/my-orders', authMiddleware, getBuyerOrders);
OrderRoutes.get('/seller-orders', authMiddleware, authorizeRoles('seller'), getSellerOrders);
OrderRoutes.get('/:id', authMiddleware, getOrderById);
OrderRoutes.post('/:id/update-status', authMiddleware, updateOrderStatus);
OrderRoutes.get('/:id/receipt', authMiddleware, generateOrderReceipt);
OrderRoutes.post('/:id/cancel', authMiddleware, cancelOrder);

// Admin only routes
OrderRoutes.get('/', authMiddleware, authorizeRoles('admin'), getOrders);

export default OrderRoutes;