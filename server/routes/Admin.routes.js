import express from 'express';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

const router = express.Router();

// Admin login
router.post('/auth/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Generate token
        const token = user.generateAuthToken();

        // Return user info and token
        res.json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current admin
router.get('/auth/admin/me', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get admin error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// User management
router.get('/admin/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user by ID
router.get('/admin/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user
router.put('/admin/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user
router.delete('/admin/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Ban user
router.post('/admin/users/:userId/ban', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBanned = true;
        await user.save();

        res.json({ message: 'User banned successfully', user });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Unban user
router.post('/admin/users/:userId/unban', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBanned = false;
        await user.save();

        res.json({ message: 'User unbanned successfully', user });
    } catch (error) {
        console.error('Unban user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Product management routes
router.get('/admin/products', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .populate('category')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        res.json({
            products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Seller application management
router.get('/admin/seller-applications', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        // Find users with pending seller applications
        const applications = await User.find({
            'sellerApplication.status': 'pending'
        }).select('name email sellerApplication createdAt');

        res.json({ applications });
    } catch (error) {
        console.error('Get seller applications error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve seller application
router.post('/admin/seller-applications/:userId/approve', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.sellerApplication || user.sellerApplication.status !== 'pending') {
            return res.status(400).json({ message: 'No pending seller application found' });
        }

        // Update user to seller role and application status
        user.role = 'seller';
        user.sellerApplication.status = 'approved';
        user.sellerApplication.reviewedAt = new Date();
        user.sellerApplication.reviewedBy = req.user.id;

        await user.save();

        // You could send notification email here

        res.json({
            message: 'Seller application approved successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerApplication: user.sellerApplication
            }
        });
    } catch (error) {
        console.error('Approve seller application error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reject seller application
router.post('/admin/seller-applications/:userId/reject', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { reason } = req.body;

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.sellerApplication || user.sellerApplication.status !== 'pending') {
            return res.status(400).json({ message: 'No pending seller application found' });
        }

        // Update application status
        user.sellerApplication.status = 'rejected';
        user.sellerApplication.rejectionReason = reason || 'Application rejected by administrator';
        user.sellerApplication.reviewedAt = new Date();
        user.sellerApplication.reviewedBy = req.user.id;

        await user.save();

        // You could send notification email here

        res.json({
            message: 'Seller application rejected',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                sellerApplication: user.sellerApplication
            }
        });
    } catch (error) {
        console.error('Reject seller application error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Analytics endpoints
router.get('/admin/analytics/dashboard', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Total users
        const totalUsers = await User.countDocuments();
        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Total products
        const totalProducts = await Product.countDocuments();
        const newProductsToday = await Product.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Total orders
        const totalOrders = await Order.countDocuments();
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // Revenue
        const allTimeRevenue = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const monthlyRevenue = await Order.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const dailyRevenue = await Order.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            users: {
                total: totalUsers,
                today: newUsersToday
            },
            products: {
                total: totalProducts,
                today: newProductsToday
            },
            orders: {
                total: totalOrders,
                today: ordersToday
            },
            revenue: {
                total: allTimeRevenue.length > 0 ? allTimeRevenue[0].total : 0,
                monthly: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
                daily: dailyRevenue.length > 0 ? dailyRevenue[0].total : 0
            }
        });
    } catch (error) {
        console.error('Dashboard analytics error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// More detailed analytics for sales
router.get('/admin/analytics/sales', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const now = new Date();
        let startDate;
        let groupBy;

        switch (period) {
            case 'daily':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30); // Last 30 days
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 90); // Last 90 days
                groupBy = {
                    $week: "$createdAt",
                    $year: "$createdAt"
                };
                break;
            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 12); // Last 12 months
                groupBy = {
                    $month: "$createdAt",
                    $year: "$createdAt"
                };
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
                groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        // Get sales data
        const salesData = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    sales: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.json({ salesData });
    } catch (error) {
        console.error('Sales analytics error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;