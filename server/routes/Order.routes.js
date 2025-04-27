import express from 'express';
import {
    placeOrder,
    getOrders,
    getOrderById,
    getBuyerOrders,
    getSellerOrders,
    updateOrderStatus,
    generateOrderReceipt,
    cancelOrder,
    acceptBarterProposal,
    rejectBarterProposal
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
OrderRoutes.post('/:id/accept-barter', authMiddleware, authorizeRoles('seller'), acceptBarterProposal);
OrderRoutes.post('/:id/reject-barter', authMiddleware, authorizeRoles('seller'), rejectBarterProposal);

// Admin only routes
OrderRoutes.get('/', authMiddleware, authorizeRoles('admin'), getOrders);

export default OrderRoutes;