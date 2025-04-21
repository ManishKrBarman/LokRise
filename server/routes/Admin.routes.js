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
router.get('/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.get('/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.put('/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.delete('/users/:userId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.post('/users/:userId/ban', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.post('/users/:userId/unban', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.get('/products', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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

// Get product by ID
router.get('/products/:productId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
            .populate('category')
            .populate('seller', 'name email');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product
router.put('/products/:productId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product
router.delete('/products/:productId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Order management routes
router.get('/orders', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            orders,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get order by ID
router.get('/orders/:orderId', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update order status
router.put('/orders/:orderId/status', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Seller application management
router.get('/seller-applications', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { status = 'pending' } = req.query;

        // Create a query to find users with seller applications matching the requested status
        // Only find users that have a sellerApplication field with the requested status
        const query = { 'sellerApplication.status': status };

        // Find users with seller applications of the specified status
        const applications = await User.find(query)
            .select('name email phone sellerApplication address bankDetails businessDetails identityDetails createdAt updatedAt')
            .sort({ 'sellerApplication.submittedAt': -1 });

        res.json({ applications });
    } catch (error) {
        console.error('Get seller applications error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Approve seller application
router.post('/seller-applications/:userId/approve', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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

        // Add notification to the user
        user.notifications.push({
            message: 'Congratulations! Your seller application has been approved. You can now start selling on LokRise.',
            type: 'system',
            read: false,
            link: '/dashboard',
            createdAt: new Date()
        });

        await user.save();

        // In a production environment, you could send notification email here

        res.json({
            success: true,
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
router.post('/seller-applications/:userId/reject', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.sellerApplication || user.sellerApplication.status !== 'pending') {
            return res.status(400).json({ message: 'No pending seller application found' });
        }

        // Update application status
        user.sellerApplication.status = 'rejected';
        user.sellerApplication.rejectionReason = reason;
        user.sellerApplication.reviewedAt = new Date();
        user.sellerApplication.reviewedBy = req.user.id;

        // Add notification to the user
        user.notifications.push({
            message: 'Your seller application has been reviewed. Unfortunately, we are unable to approve it at this time. Please check your application status for details.',
            type: 'system',
            read: false,
            link: '/seller/application-status',
            createdAt: new Date()
        });

        await user.save();

        // In a production environment, you could send notification email here

        res.json({
            success: true,
            message: 'Seller application rejected',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                sellerApplication: {
                    status: user.sellerApplication.status,
                    rejectionReason: user.sellerApplication.rejectionReason,
                    reviewedAt: user.sellerApplication.reviewedAt
                }
            }
        });
    } catch (error) {
        console.error('Reject seller application error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Analytics endpoints
router.get('/analytics/dashboard', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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
router.get('/analytics/sales', authMiddleware, authorizeRoles('admin'), async (req, res) => {
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

// User stats analytics
router.get('/analytics/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        const now = new Date();
        const pastYear = new Date(now);
        pastYear.setFullYear(now.getFullYear() - 1);

        // Monthly user registrations
        const userRegistrations = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: pastYear }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // User role distribution
        const roleDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            userRegistrations,
            roleDistribution
        });
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Product stats analytics
router.get('/analytics/products', authMiddleware, authorizeRoles('admin'), async (req, res) => {
    try {
        // Product category distribution
        const categoryDistribution = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Products added over time
        const now = new Date();
        const pastYear = new Date(now);
        pastYear.setFullYear(now.getFullYear() - 1);

        const productsOverTime = await Product.aggregate([
            {
                $match: {
                    createdAt: { $gte: pastYear }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            categoryDistribution,
            productsOverTime
        });
    } catch (error) {
        console.error('Product stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;