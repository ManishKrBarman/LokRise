import Order from '../models/order.js';
import Product from '../models/product.js';
import UserModel from '../models/user.js';
import mongoose from 'mongoose';

// Place a new order
export const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            products,
            shippingAddress,
            paymentMethod,
            paymentDetails,
            totalAmount,
            couponApplied
        } = req.body;

        // Validate products array exists
        if (!products || !Array.isArray(products) || products.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Products array is required and cannot be empty',
                received: JSON.stringify(req.body)
            });
        }

        // Validate products exist and have sufficient inventory
        const productIds = products.map(item => item.product);
        const productsInDb = await Product.find({ _id: { $in: productIds } }).session(session);

        if (productsInDb.length !== productIds.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'One or more products not found' });
        }

        // Check inventory and collect seller information
        const sellerOrders = {};
        const productUpdates = [];

        for (const item of products) {
            const product = productsInDb.find(p => p._id.toString() === item.product.toString());

            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            if (product.quantityAvailable < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: `Insufficient inventory for ${product.name}. Available: ${product.quantityAvailable}`
                });
            }

            // Update inventory
            productUpdates.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: {
                        $inc: {
                            quantityAvailable: -item.quantity,
                            'metrics.totalSales': item.quantity,
                            'metrics.totalRevenue': item.quantity * product.price
                        }
                    }
                }
            });

            // Group items by seller
            const sellerId = product.seller.toString();
            if (!sellerOrders[sellerId]) {
                sellerOrders[sellerId] = {
                    seller: sellerId,
                    products: [],
                    totalAmount: 0
                };
            }

            sellerOrders[sellerId].products.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                isDigital: product.isDigital || false
            });

            sellerOrders[sellerId].totalAmount += item.quantity * product.price;
        }

        // Create an order for each seller
        const orderIds = [];
        const orders = [];

        for (const sellerId in sellerOrders) {
            const sellerOrder = new Order({
                orderNumber: `ORD-${Date.now()}-${sellerId.substr(0, 5)}`,
                buyer: req.user.id,
                seller: sellerId,
                items: sellerOrders[sellerId].products, // Fixed: changed 'products' to 'items' to match schema
                subTotal: sellerOrders[sellerId].totalAmount, // Add the required subTotal field
                shippingAddress,
                paymentMethod,
                paymentDetails,
                totalAmount: sellerOrders[sellerId].totalAmount,
                couponApplied,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
                statusHistory: [{
                    status: 'pending',
                    date: new Date(),
                    note: 'Order placed successfully'
                }]
            });

            await sellerOrder.save({ session });
            orderIds.push(sellerOrder._id);
            orders.push(sellerOrder);

            // Update seller metrics
            await UserModel.findByIdAndUpdate(
                sellerId,
                {
                    $inc: {
                        'metrics.totalSales': sellerOrder.items.reduce((total, item) => total + item.quantity, 0), // Fixed: use items instead of products
                        'metrics.totalRevenue': sellerOrder.totalAmount
                    }
                },
                { session }
            );
        }

        // Update product inventory in bulk
        await Product.bulkWrite(productUpdates, { session });

        // Update buyer metrics
        await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $inc: {
                    'metrics.totalPurchases': 1,
                    'metrics.totalSpent': totalAmount
                }
            },
            { session }
        );

        // Create notification for buyer
        await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $push: {
                    notifications: {
                        message: `Your order has been placed successfully. Order IDs: ${orderIds.join(', ')}`,
                        type: 'order',
                        read: false,
                        createdAt: new Date()
                    }
                }
            },
            { session }
        );

        // Create notifications for sellers
        for (const sellerId in sellerOrders) {
            await UserModel.findByIdAndUpdate(
                sellerId,
                {
                    $push: {
                        notifications: {
                            message: 'You have received a new order',
                            type: 'order',
                            read: false,
                            createdAt: new Date()
                        }
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Order placed successfully',
            orders: orders.map(order => ({
                id: order._id,
                orderNumber: order.orderNumber,
                seller: order.seller,
                totalAmount: order.totalAmount,
                status: order.status
            }))
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Place order error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get all orders for admin
export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const query = {};

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .populate('products.product', 'name price images');

        // Get total count
        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            currentPage: pageNum,
            totalPages: Math.ceil(totalOrders / limitNum),
            totalOrders
        });
    } catch (err) {
        console.error('Get orders error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get specific order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }

        const order = await Order.findById(id)
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email')
            .populate('products.product', 'name price images description');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user has permission to view this order
        if (
            req.user.id !== order.buyer._id.toString() &&
            req.user.id !== order.seller._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'You do not have permission to view this order' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error('Get order by ID error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get buyer's orders
export const getBuyerOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { buyer: req.user.id };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('seller', 'name')
            .populate('products.product', 'name price images');

        // Get total count
        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            currentPage: pageNum,
            totalPages: Math.ceil(totalOrders / limitNum),
            totalOrders
        });
    } catch (err) {
        console.error('Get buyer orders error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get seller's orders
export const getSellerOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { seller: req.user.id };

        // Filter by status if provided
        if (status) {
            query.status = status;
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('buyer', 'name')
            .populate('products.product', 'name price images');

        // Get total count
        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            orders,
            currentPage: pageNum,
            totalPages: Math.ceil(totalOrders / limitNum),
            totalOrders
        });
    } catch (err) {
        console.error('Get seller orders error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, description } = req.body;

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Validate permissions
        if (req.user.role === 'buyer' && req.user.id !== order.buyer.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this order' });
        }

        if (req.user.role === 'seller' && req.user.id !== order.seller.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this order' });
        }

        // Add restrictions based on role and current status
        if (req.user.role === 'buyer') {
            // Buyers can only cancel if order is still pending
            if (status !== 'cancelled' || order.status !== 'pending') {
                return res.status(403).json({
                    message: 'Buyers can only cancel pending orders'
                });
            }
        }

        // Update order
        order.status = status;
        order.updatedAt = new Date();

        // Add to statusHistory
        order.statusHistory.push({
            status,
            date: new Date(),
            note: description || `Order status updated to ${status}`
        });

        await order.save();

        // Add notification for the other party
        const notificationUserId = req.user.role === 'seller' ? order.buyer : order.seller;
        const notificationMessage = req.user.role === 'seller'
            ? `Your order #${order.orderNumber} has been updated to: ${status}`
            : `Order #${order.orderNumber} status has been updated to: ${status}`;

        await UserModel.findByIdAndUpdate(
            notificationUserId,
            {
                $push: {
                    notifications: {
                        message: notificationMessage,
                        type: 'order',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            message: 'Order status updated successfully',
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                statusHistory: order.statusHistory
            }
        });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Generate order receipt
export const generateOrderReceipt = async (req, res) => {
    try {
        const { id } = req.params;

        // Find order
        const order = await Order.findById(id)
            .populate('buyer', 'name email phone address')
            .populate('seller', 'name email businessDetails')
            .populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user has permission to access this order
        if (
            req.user.id !== order.buyer._id.toString() &&
            req.user.id !== order.seller._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'You do not have permission to view this receipt' });
        }

        // Generate receipt data
        const receipt = {
            receiptId: `RCT-${order._id.toString().substr(0, 8)}`,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt,
            buyer: {
                name: order.buyer.name,
                email: order.buyer.email,
                phone: order.buyer.phone,
                address: order.shippingAddress || order.buyer.address
            },
            seller: {
                name: order.seller.name,
                email: order.seller.email,
                businessName: order.seller.businessDetails?.businessName,
                gstin: order.seller.businessDetails?.gstin
            },
            products: order.products.map(item => ({
                name: item.name || item.product.name,
                price: item.price || item.product.price,
                quantity: item.quantity,
                subtotal: (item.price || item.product.price) * item.quantity
            })),
            paymentMethod: order.paymentMethod,
            paymentDetails: order.paymentDetails,
            subtotal: order.products.reduce((total, item) => {
                return total + ((item.price || item.product.price) * item.quantity);
            }, 0),
            discount: order.couponApplied ? order.discount || 0 : 0,
            totalAmount: order.totalAmount,
            status: order.status,
            generatedAt: new Date()
        };

        res.status(200).json(receipt);
    } catch (err) {
        console.error('Generate receipt error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user has permission to cancel this order
        if (
            req.user.id !== order.buyer.toString() &&
            req.user.id !== order.seller.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'You do not have permission to cancel this order' });
        }

        // Check if order can be cancelled
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({
                message: 'Only pending or processing orders can be cancelled'
            });
        }

        // Update order status
        order.status = 'cancelled';
        order.cancellationReason = reason;
        order.updatedAt = new Date();

        // Add to statusHistory
        order.statusHistory.push({
            status: 'cancelled',
            date: new Date(),
            note: `Order cancelled: ${reason || 'No reason provided'}`
        });

        await order.save();

        // Restore product inventory
        const productUpdates = [];
        for (const item of order.products) {
            productUpdates.push({
                updateOne: {
                    filter: { _id: item.product },
                    update: {
                        $inc: { quantityAvailable: item.quantity }
                    }
                }
            });
        }

        if (productUpdates.length > 0) {
            await Product.bulkWrite(productUpdates);
        }

        // Notify other party
        const notificationUserId = req.user.id === order.buyer.toString() ? order.seller : order.buyer;
        const canceller = req.user.id === order.buyer.toString() ? 'Buyer' : 'Seller';

        await UserModel.findByIdAndUpdate(
            notificationUserId,
            {
                $push: {
                    notifications: {
                        message: `Order #${order.orderNumber} has been cancelled by ${canceller}. Reason: ${reason || 'Not provided'}`,
                        type: 'order',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            message: 'Order cancelled successfully',
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                statusHistory: order.statusHistory
            }
        });
    } catch (err) {
        console.error('Cancel order error:', err);
        res.status(500).json({ message: err.message });
    }
};