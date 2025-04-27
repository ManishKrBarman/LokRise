import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price at the time of purchase
    productName: { type: String }, // Saved in case product details change later
    productType: { type: String, enum: ['physical', 'course'] },
    productImage: { type: String }
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true }, // User-friendly order ID (e.g., ORD-10012)
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subTotal: { type: Number, required: false },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },

    // Order Status - updated to include awaiting_barter_approval
    status: {
        type: String,
        enum: ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded', 'awaiting_barter_approval'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded', 'awaiting_barter_approval']
        },
        date: { type: Date, default: Date.now },
        note: { type: String }
    }],

    // Payment Information
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
    paymentDate: { type: Date },

    // Payment Details - Add detailed structure for different payment methods including barter
    paymentDetails: {
        paymentMethod: { type: String },
        paymentStatus: { type: String },
        // For online payments
        transactionId: { type: String },
        transactionRef: { type: String },
        paymentGateway: { type: String },
        paymentInitiated: { type: Date },
        paymentCompletedAt: { type: Date },
        // For cards
        lastFourDigits: { type: String },
        // For UPI
        upiId: { type: String },
        upiTransactionRef: { type: String },
        // For Barter
        barterProposal: {
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            item: {
                title: { type: String },
                category: { type: String },
                description: { type: String },
                estimatedValue: { type: Number },
                topUpAmount: { type: Number, default: 0 },
                photos: [{ type: String }]
            },
            status: { type: String, default: 'pending' },
            createdAt: { type: Date },
            barterAcceptedAt: { type: Date },
            barterRejectedAt: { type: Date }
        },
        // For COD
        CODRequested: { type: Date },
        // For refunds
        refundAmount: { type: Number },
        refundDate: { type: Date },
        refundRef: { type: String },
        refundReason: { type: String }
    },

    // Shipping Information
    shippingAddress: {
        name: { type: String },
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String, default: 'India' },
        pinCode: { type: String },
        phone: { type: String }
    },

    // Shipping and tracking
    shippingCarrier: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    deliveryNotes: { type: String },

    // For course products
    accessGranted: { type: Boolean, default: false },
    accessExpiryDate: { type: Date },

    // Notes
    customerNote: { type: String },
    sellerNote: { type: String },
    adminNote: { type: String },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Generate a unique order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;

    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;