// routes/Pay.routes.js
import express from 'express';
import {
    initiateUpiPayment,
    verifyPayment,
    processCardPayment,
    processCOD,
    generateReceipt,
    processRefund
} from '../controllers/Pay.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';

const PayRoutes = express.Router();

// UPI Payment routes
PayRoutes.post('/upi/initiate', authMiddleware, initiateUpiPayment);
PayRoutes.post('/upi/verify', authMiddleware, verifyPayment);

// Card payment routes
PayRoutes.post('/card/process', authMiddleware, processCardPayment);

// Cash on Delivery
PayRoutes.post('/cod/process', authMiddleware, processCOD);

// Receipt generation
PayRoutes.get('/receipt/:orderId', authMiddleware, generateReceipt);

// Refund processing - sellers and admins only
PayRoutes.post('/refund', authMiddleware, authorizeRoles('seller', 'admin'), processRefund);

export default PayRoutes;