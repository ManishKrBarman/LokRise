import express from 'express';
import {
    register,
    verifyEmail,
    registerSeller,
    login,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateProfile
} from '../controllers/Auth.js';
import { authMiddleware } from '../middlewares/auth.js';

const AuthRoutes = express.Router();

// Public routes
AuthRoutes.post('/register', register);
AuthRoutes.post('/verify-email', verifyEmail);
AuthRoutes.post('/seller/register', registerSeller);
AuthRoutes.post('/login', login);
AuthRoutes.post('/forgot-password', forgotPassword);
AuthRoutes.post('/reset-password', resetPassword);

// Protected routes
AuthRoutes.get('/me', authMiddleware, getCurrentUser);
AuthRoutes.put('/update-profile', authMiddleware, updateProfile);

export default AuthRoutes;