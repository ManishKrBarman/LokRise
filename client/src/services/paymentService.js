import { paymentAPI, orderAPI } from './api';

/**
 * Payment Service - Handles different payment methods and flows
 */
export const PaymentService = {
    /**
     * Process UPI payment
     * @param {Object} orderData - Order data with seller and amount information
     * @returns {Promise} Promise with payment result
     */
    processUpiPayment: async (orderData) => {
        try {
            // 1. Initiate UPI payment
            const initiateResponse = await paymentAPI.initiateUpiPayment({
                sellerId: orderData.sellerId,
                amount: orderData.amount,
                orderId: orderData.orderId,
                description: `Payment for order ${orderData.orderNumber || orderData.orderId}`
            });

            // Return QR code and payment data to display to user
            return {
                success: true,
                paymentData: initiateResponse.data,
                paymentMethod: 'UPI'
            };
        } catch (error) {
            console.error("UPI payment initiation failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to initiate UPI payment",
                paymentMethod: 'UPI'
            };
        }
    },

    /**
     * Verify UPI payment status after user completes payment
     * @param {String} transactionRef - Transaction reference from payment initiation
     * @param {String} orderId - Order ID
     * @returns {Promise} Promise with verification result
     */
    verifyUpiPayment: async (transactionRef, orderId) => {
        try {
            const verifyResponse = await paymentAPI.verifyUpiPayment({
                transactionRef,
                orderId
            });

            return {
                success: true,
                verificationData: verifyResponse.data,
                paymentMethod: 'UPI'
            };
        } catch (error) {
            console.error("UPI payment verification failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to verify UPI payment",
                paymentMethod: 'UPI'
            };
        }
    },

    /**
     * Process card payment
     * @param {Object} cardData - Card payment details
     * @param {String} orderId - Order ID
     * @param {Number} amount - Payment amount
     * @returns {Promise} Promise with payment result
     */
    processCardPayment: async (cardData, orderId, amount) => {
        try {
            const paymentResponse = await paymentAPI.processCardPayment({
                orderId,
                cardNumber: cardData.cardNumber,
                cardHolderName: cardData.cardHolderName,
                expiryMonth: cardData.expiryMonth,
                expiryYear: cardData.expiryYear,
                cvv: cardData.cvv,
                amount
            });

            return {
                success: true,
                paymentData: paymentResponse.data,
                paymentMethod: 'CARD'
            };
        } catch (error) {
            console.error("Card payment failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to process card payment",
                paymentMethod: 'CARD'
            };
        }
    },

    /**
     * Process Cash on Delivery
     * @param {String} orderId - Order ID
     * @returns {Promise} Promise with COD setup result
     */
    processCOD: async (orderId) => {
        try {
            const codResponse = await paymentAPI.processCOD({ orderId });

            return {
                success: true,
                paymentData: codResponse.data,
                paymentMethod: 'COD'
            };
        } catch (error) {
            console.error("COD setup failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to set up Cash on Delivery",
                paymentMethod: 'COD'
            };
        }
    },

    /**
     * Generate payment receipt
     * @param {String} orderId - Order ID
     * @returns {Promise} Promise with receipt data
     */
    generateReceipt: async (orderId) => {
        try {
            const receiptResponse = await paymentAPI.generatePaymentReceipt(orderId);

            return {
                success: true,
                receipt: receiptResponse.data.receipt
            };
        } catch (error) {
            console.error("Receipt generation failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to generate receipt"
            };
        }
    },

    /**
     * Process refund (seller only)
     * @param {String} orderId - Order ID
     * @param {String} reason - Refund reason
     * @param {Number} refundAmount - Optional refund amount (defaults to full order amount)
     * @returns {Promise} Promise with refund result
     */
    processRefund: async (orderId, reason, refundAmount = null) => {
        try {
            const refundResponse = await paymentAPI.processRefund({
                orderId,
                reason,
                refundAmount
            });

            return {
                success: true,
                refundData: refundResponse.data
            };
        } catch (error) {
            console.error("Refund processing failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to process refund"
            };
        }
    },

    /**
     * Complete checkout process - Place order and handle payment
     * @param {Object} orderDetails - Order details including products, shipping, etc.
     * @param {String} paymentMethod - Payment method (UPI, CARD, COD)
     * @param {Object} paymentDetails - Payment specific details
     * @returns {Promise} Promise with complete checkout result
     */
    completeCheckout: async (orderDetails, paymentMethod, paymentDetails) => {
        try {
            // 1. Place the order first
            const orderResponse = await orderAPI.placeOrder(orderDetails);
            const orders = orderResponse.data.orders;

            if (!orders || orders.length === 0) {
                throw new Error("Order placement failed");
            }

            // For simplicity, we'll handle the first order's payment
            // In a real app, you might want to handle each order separately or batch them
            const firstOrder = orders[0];
            let paymentResult;

            // 2. Process payment based on selected method
            switch (paymentMethod) {
                case 'UPI':
                    paymentResult = await PaymentService.processUpiPayment({
                        sellerId: firstOrder.seller,
                        amount: firstOrder.totalAmount,
                        orderId: firstOrder.id,
                        orderNumber: firstOrder.orderNumber
                    });
                    break;

                case 'CARD':
                    paymentResult = await PaymentService.processCardPayment(
                        paymentDetails,
                        firstOrder.id,
                        firstOrder.totalAmount
                    );
                    break;

                case 'COD':
                    paymentResult = await PaymentService.processCOD(firstOrder.id);
                    break;

                default:
                    throw new Error("Invalid payment method");
            }

            // Return combined result
            return {
                success: true,
                orders,
                payment: paymentResult
            };
        } catch (error) {
            console.error("Checkout failed:", error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || "Checkout failed"
            };
        }
    }
};

export default PaymentService;