import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

// Authentication middleware - verifies JWT token
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');

        // Find user
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Email not verified' });
        }

        // Set user on request object
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};

// Seller approval middleware
export const requireApprovedSeller = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied, seller role required' });
        }

        if (user.sellerStatus !== 'approved') {
            return res.status(403).json({
                message: 'Your seller account is pending approval or has been rejected',
                status: user.sellerStatus
            });
        }

        next();
    } catch (error) {
        console.error('Seller approval middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};