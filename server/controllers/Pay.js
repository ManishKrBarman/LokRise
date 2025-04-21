// controllers/Pay.js
import UserModel from '../models/user.js';
import Order from '../models/order.js';
import QRCode from 'qrcode';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Generate UPI payment
const initiateUpiPayment = async (req, res) => {
    try {
        const { sellerId, amount, orderId, description } = req.body;

        console.log('UPI Payment Request:', {
            sellerId: typeof sellerId === 'object' ? 'Object (needs toString)' : sellerId,
            amount,
            orderId
        });

        // Basic validation
        if (!sellerId || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid seller ID or amount'
            });
        }

        // If sellerId is an object, try to extract _id
        let sellerIdToUse = sellerId;
        if (typeof sellerId === 'object' && sellerId._id) {
            sellerIdToUse = sellerId._id;
            console.log(`Converting object sellerId to string: ${sellerIdToUse}`);
        }

        // Find seller by ID or email
        const seller = await UserModel.findOne({
            $or: [
                { _id: sellerIdToUse },
                { email: sellerIdToUse }
            ],
            role: 'seller'
        });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found'
            });
        }

        // Use the seller's UPI ID or a default one for testing
        let upiId = seller.upiId;
        if (!upiId) {
            // For development purposes, use a default UPI ID
            upiId = 'defaultseller@upi';
            console.log(`Warning: Seller ${seller._id} doesn't have a UPI ID. Using default: ${upiId}`);
        }

        // Generate transaction reference
        const transactionRef = `TXN${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // Generate UPI payment link with the transaction reference
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(seller.name)}&am=${amount}&cu=INR&tr=${transactionRef}&tn=${encodeURIComponent(description || 'Payment')}`;

        // Generate QR code
        const qrCode = await QRCode.toDataURL(upiLink);

        // Save payment record if orderId is provided
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentDetails = {
                    ...order.paymentDetails,
                    transactionRef,
                    paymentInitiated: new Date(),
                    paymentMethod: 'UPI',
                    upiId: upiId
                };

                await order.save();
            }
        }

        res.status(200).json({
            success: true,
            qrCode,
            upiLink,
            sellerName: seller.name,
            amount,
            transactionRef,
            message: 'Payment initiated. Complete the payment using your UPI app.'
        });
    } catch (error) {
        console.error('UPI payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Verify payment status
const verifyPayment = async (req, res) => {
    try {
        const { transactionRef, orderId } = req.body;

        if (!transactionRef || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Transaction reference and order ID are required'
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if the transaction reference matches
        if (order.paymentDetails?.transactionRef !== transactionRef) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transaction reference'
            });
        }

        // In a real-world scenario, you'd verify the payment with the payment gateway
        // For now, we'll simulate a successful payment

        // Update order payment status
        order.paymentDetails.paymentStatus = 'completed';
        order.paymentDetails.paymentCompletedAt = new Date();

        // Update order status
        if (order.status === 'pending') {
            order.status = 'processing';
            order.statusHistory.push({
                status: 'processing',
                date: new Date(),
                note: 'Payment completed, order is now processing'
            });
        }

        await order.save();

        // Notify the seller
        await UserModel.findByIdAndUpdate(
            order.seller,
            {
                $push: {
                    notifications: {
                        message: `Payment received for order ${order.orderNumber}`,
                        type: 'payment',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentDetails.paymentStatus
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Process card payment
const processCardPayment = async (req, res) => {
    try {
        const {
            orderId,
            cardNumber,
            cardHolderName,
            expiryMonth,
            expiryYear,
            cvv,
            amount
        } = req.body;

        // Basic validation
        if (!orderId || !cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv || !amount) {
            return res.status(400).json({
                success: false,
                message: 'All payment fields are required'
            });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if payment has already been processed
        if (order.paymentDetails?.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment has already been completed for this order'
            });
        }

        // In a real implementation, you would send this info to a payment gateway
        // For now, we'll simulate a successful transaction

        // Generate a transaction reference
        const transactionRef = `CARD${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        // Update order payment status
        order.paymentDetails = {
            transactionRef,
            paymentMethod: 'CARD',
            paymentInitiated: new Date(),
            paymentCompletedAt: new Date(),
            paymentStatus: 'completed',
            lastFourDigits: cardNumber.slice(-4)
        };

        // Update order status
        if (order.status === 'pending') {
            order.status = 'processing';
            order.statusHistory.push({
                status: 'processing',
                date: new Date(),
                note: 'Payment completed, order is now processing'
            });
        }

        await order.save();

        // Notify the seller
        await UserModel.findByIdAndUpdate(
            order.seller,
            {
                $push: {
                    notifications: {
                        message: `Payment received for order ${order.orderNumber}`,
                        type: 'payment',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Card payment processed successfully',
            transactionRef,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentDetails.paymentStatus
            }
        });
    } catch (error) {
        console.error('Card payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Process Cash on Delivery
const processCOD = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Validate order ID
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order payment details
        order.paymentMethod = 'COD';
        order.paymentDetails = {
            paymentMethod: 'COD',
            paymentStatus: 'pending',
            CODRequested: new Date()
        };

        // Update order status if needed
        if (order.status === 'pending') {
            order.status = 'processing';
            order.statusHistory.push({
                status: 'processing',
                date: new Date(),
                note: 'Order confirmed with Cash on Delivery option'
            });
        }

        await order.save();

        // Notify the seller
        await UserModel.findByIdAndUpdate(
            order.seller,
            {
                $push: {
                    notifications: {
                        message: `New COD order: ${order.orderNumber}`,
                        type: 'order',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Cash on Delivery request processed successfully',
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status
            }
        });
    } catch (error) {
        console.error('COD processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Create payment receipt
const generateReceipt = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID format'
            });
        }

        const order = await Order.findById(orderId)
            .populate('buyer', 'name email phone address')
            .populate('seller', 'name email businessDetails')
            .populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Ensure the user has permission to access this receipt
        if (
            req.user.id !== order.buyer.toString() &&
            req.user.id !== order.seller.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this receipt'
            });
        }

        // Check if payment is completed
        if (order.paymentDetails?.paymentStatus !== 'completed' && order.paymentMethod !== 'COD') {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed yet'
            });
        }

        // Generate receipt
        const receipt = {
            receiptId: `RCT-${Date.now().toString(36)}`,
            transactionRef: order.paymentDetails?.transactionRef || 'N/A',
            orderNumber: order.orderNumber,
            date: new Date(),
            paymentMethod: order.paymentMethod,
            paymentDate: order.paymentDetails?.paymentCompletedAt || new Date(),
            customerDetails: {
                name: order.buyer.name,
                email: order.buyer.email,
                phone: order.buyer.phone
            },
            sellerDetails: {
                name: order.seller.name,
                businessName: order.seller.businessDetails?.businessName || order.seller.name,
                gstin: order.seller.businessDetails?.gstin || 'N/A'
            },
            items: order.products.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            subtotal: order.products.reduce((total, item) => total + (item.price * item.quantity), 0),
            discount: order.discount || 0,
            shippingFee: order.shippingFee || 0,
            tax: order.tax || 0,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
            paymentStatus: order.paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid',
            notes: `Thank you for shopping with us!`
        };

        res.status(200).json({
            success: true,
            receipt
        });
    } catch (error) {
        console.error('Receipt generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Record refund
const processRefund = async (req, res) => {
    try {
        const { orderId, reason, refundAmount } = req.body;

        if (!orderId || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and reason are required'
            });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if the user is authorized to process refunds
        if (req.user.id !== order.seller.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to process refunds for this order'
            });
        }

        // Check if payment was completed (can't refund COD before delivery)
        if (
            (order.paymentMethod === 'COD' && order.status !== 'delivered') ||
            (order.paymentMethod !== 'COD' && order.paymentDetails?.paymentStatus !== 'completed')
        ) {
            return res.status(400).json({
                success: false,
                message: 'Cannot refund an order that has not been paid'
            });
        }

        // Check if already refunded
        if (order.paymentDetails?.refunded) {
            return res.status(400).json({
                success: false,
                message: 'This order has already been refunded'
            });
        }

        // Process the refund (in a real implementation, you would call payment gateway APIs)
        const refundRef = `REF${Date.now()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const refundAmt = refundAmount || order.totalAmount;

        // Update order
        order.status = 'refunded';
        order.paymentDetails.refunded = true;
        order.paymentDetails.refundAmount = refundAmt;
        order.paymentDetails.refundReason = reason;
        order.paymentDetails.refundRef = refundRef;
        order.paymentDetails.refundDate = new Date();

        // Update statusHistory
        order.statusHistory.push({
            status: 'refunded',
            date: new Date(),
            note: `Refund processed. Reason: ${reason}`
        });

        await order.save();

        // Notify the buyer
        await UserModel.findByIdAndUpdate(
            order.buyer,
            {
                $push: {
                    notifications: {
                        message: `Refund processed for your order ${order.orderNumber}`,
                        type: 'payment',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            refundRef,
            refundAmount: refundAmt,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Process barter proposal
const processBarterProposal = async (req, res) => {
    try {
        const { orderId, title, category, description, estimatedValue, topUpAmount } = req.body;

        // Validate required fields
        if (!orderId || !title || !category || !description || estimatedValue === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All barter details are required'
            });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if payment has already been processed
        if (order.paymentDetails?.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment has already been completed for this order'
            });
        }

        // Handle file uploads if any
        let photoUrls = [];
        if (req.files && req.files.photos) {
            const photos = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

            // Process each uploaded photo
            for (const photo of photos) {
                // Generate a unique file name
                const fileName = `${Date.now()}-${photo.name.replace(/\s/g, '_')}`;
                const filePath = `./temp/uploads/${fileName}`;

                // Move the file to the uploads folder
                await photo.mv(filePath);

                // Store the file URL (relative path that will be used to serve the file)
                photoUrls.push(`/uploads/${fileName}`);
            }
        }

        // Create barter proposal
        const barterProposal = {
            orderId: order._id,
            buyer: req.user.id,
            seller: order.seller,
            item: {
                title,
                category,
                description,
                estimatedValue: parseFloat(estimatedValue),
                topUpAmount: topUpAmount ? parseFloat(topUpAmount) : 0,
                photos: photoUrls
            },
            status: 'pending',
            createdAt: new Date()
        };

        // Save barter proposal to order
        order.paymentMethod = 'BARTER';
        order.paymentDetails = {
            paymentMethod: 'BARTER',
            barterProposal,
            paymentStatus: 'pending',
            barterRequested: new Date()
        };

        // Update order status
        if (order.status === 'pending') {
            order.status = 'awaiting_barter_approval';
            order.statusHistory.push({
                status: 'awaiting_barter_approval',
                date: new Date(),
                note: 'Barter proposal submitted and awaiting seller approval'
            });
        }

        await order.save();

        // Notify the seller
        await UserModel.findByIdAndUpdate(
            order.seller,
            {
                $push: {
                    notifications: {
                        message: `New barter proposal received for order ${order.orderNumber}`,
                        type: 'barter',
                        read: false,
                        link: `/orders/${order._id}`,
                        createdAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Barter proposal submitted successfully',
            barterProposal,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Barter processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export {
    initiateUpiPayment,
    verifyPayment,
    processCardPayment,
    processCOD,
    generateReceipt,
    processRefund,
    processBarterProposal  // Add the new controller function to exports
};