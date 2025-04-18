import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    title: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    images: [{
        type: String
    }],
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    usersFoundHelpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVisible: {
        type: Boolean,
        default: true
    },
    adminResponse: {
        content: { type: String },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    },
    sellerResponse: {
        content: { type: String },
        createdAt: { type: Date },
        updatedAt: { type: Date }
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

// Ensure a user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, {
    unique: true,
    partialFilterExpression: { product: { $exists: true } }
});

// Ensure a user can only review a seller once
reviewSchema.index({ user: 1, seller: 1 }, {
    unique: true,
    partialFilterExpression: { seller: { $exists: true } }
});

// Update product rating when a review is added or modified
reviewSchema.post('save', async function (doc) {
    if (doc.product) {
        try {
            const ReviewModel = mongoose.model('Review');

            // Calculate new product rating
            const result = await ReviewModel.aggregate([
                { $match: { product: doc.product, isVisible: true } },
                { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
            ]);

            if (result.length > 0) {
                await mongoose.model('Product').findByIdAndUpdate(doc.product, {
                    rating: result[0].averageRating,
                    reviewCount: result[0].count
                });
            }
        } catch (err) {
            console.error("Error updating product rating:", err);
        }
    }

    // Update seller rating when a review is added or modified
    if (doc.seller) {
        try {
            const ReviewModel = mongoose.model('Review');

            // Calculate new seller rating
            const result = await ReviewModel.aggregate([
                { $match: { seller: doc.seller, isVisible: true } },
                { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
            ]);

            // We would need to create a seller rating field in the user model
            // This is just a placeholder for the logic
            if (result.length > 0) {
                await mongoose.model('User').findByIdAndUpdate(doc.seller, {
                    'metrics.rating': result[0].averageRating,
                    'metrics.reviewCount': result[0].count
                });
            }
        } catch (err) {
            console.error("Error updating seller rating:", err);
        }
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;