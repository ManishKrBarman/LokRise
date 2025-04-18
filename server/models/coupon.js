// models/coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed', 'free_shipping'],
        required: true
    },
    value: {
        type: Number,
        required: true
    }, // Percentage or fixed amount
    minimumPurchase: {
        type: Number,
        default: 0
    },
    maximumDiscount: {
        type: Number
    }, // Only applies to percentage discounts
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    maxUses: {
        type: Number
    }, // Total number of times this coupon can be used
    maxUsesPerUser: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    usedBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
    }],
    // Coupon restrictions
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }], // Empty means applicable to all
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }], // Empty means applicable to all
    applicableTo: {
        type: String,
        enum: ['all', 'products', 'courses'],
        default: 'all'
    },
    isFirstOrderOnly: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function (userId, cartTotal, productIds) {
    const now = new Date();

    // Check if coupon is active
    if (!this.isActive) return false;

    // Check date validity
    if (this.endDate && now > this.endDate) return false;
    if (now < this.startDate) return false;

    // Check usage limits
    if (this.maxUses && this.usedCount >= this.maxUses) return false;

    // Check if user has already used this coupon
    if (userId) {
        const userUses = this.usedBy.filter(use =>
            use.user.toString() === userId.toString()
        ).length;

        if (userUses >= this.maxUsesPerUser) return false;
    }

    // Check minimum purchase requirement
    if (cartTotal < this.minimumPurchase) return false;

    // Check product restrictions if applicable
    if (this.applicableProducts.length > 0) {
        const applicableProductIds = this.applicableProducts.map(p => p.toString());
        if (!productIds.some(id => applicableProductIds.includes(id.toString()))) {
            return false;
        }
    }

    return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;