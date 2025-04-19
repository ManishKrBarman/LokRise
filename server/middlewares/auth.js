import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

// Authentication middleware - verifies JWT token
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Auth failed: No token or invalid token format');
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: No token provided'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecretkey');

            // Find user and exclude password
            const user = await UserModel.findById(decoded.id).select('-password');

            if (!user) {
                console.log('Auth failed: User not found for token');
                return res.status(401).json({
                    success: false,
                    message: 'Authentication failed: Invalid token'
                });
            }

            // Check if user is verified
            if (!user.isVerified) {
                console.log('Auth failed: User not verified');
                return res.status(403).json({
                    success: false,
                    message: 'Authentication failed: Email not verified'
                });
            }

            // Set user on request object
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            };

            next();
        } catch (tokenError) {
            console.log('Auth failed: Token verification error -', tokenError.message);
            return res.status(401).json({
                success: false,
                message: 'Authentication failed: Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
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