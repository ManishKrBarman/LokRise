// routes/Pay.routes.js
import express from 'express';
import {
    initiateUpiPayment,
    verifyPayment,
    processCardPayment,
    processCOD,
    generateReceipt,
    processRefund,
    processBarterProposal
} from '../controllers/Pay.js';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';
import fileUpload from 'express-fileupload';

const PayRoutes = express.Router();

// Add file upload middleware for endpoints that need it
const fileMiddleware = fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: './temp/uploads/'
});

// UPI Payment routes
PayRoutes.post('/upi/initiate', authMiddleware, initiateUpiPayment);
PayRoutes.post('/upi/verify', authMiddleware, verifyPayment);

// Card payment routes
PayRoutes.post('/card/process', authMiddleware, processCardPayment);

// Cash on Delivery
PayRoutes.post('/cod/process', authMiddleware, processCOD);

// Barter system route - add file upload middleware
PayRoutes.post('/barter', authMiddleware, fileMiddleware, processBarterProposal);

// Receipt generation
PayRoutes.get('/receipt/:orderId', authMiddleware, generateReceipt);

// Refund processing - sellers and admins only
PayRoutes.post('/refund', authMiddleware, authorizeRoles('seller', 'admin'), processRefund);

export default PayRoutes;