// models/cart.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }, // Price at time of adding to cart
    productType: {
        type: String,
        enum: ['physical', 'course'],
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, // Can be null for guest carts
    sessionId: {
        type: String
    }, // For guest carts
    items: [cartItemSchema],
    couponCode: {
        type: String
    },
    discount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    } // For guest carts cleanup
}, {
    timestamps: true
});

// Index to ensure only one cart per user
cartSchema.index({ user: 1 }, {
    unique: true,
    partialFilterExpression: { user: { $exists: true } }
});

// Index for guest carts
cartSchema.index({ sessionId: 1 }, {
    unique: true,
    partialFilterExpression: { sessionId: { $exists: true } }
});

// TTL index for guest cart expiration
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;