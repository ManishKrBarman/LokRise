// models/Product.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number }, // For showing discounts
    quantityAvailable: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    productType: {
        type: String,
        enum: ['physical', 'course'],
        default: 'physical'
    },
    // Additional fields for course products
    courseDetails: {
        level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
        duration: { type: String }, // e.g., "6 weeks", "3 months"
        topics: [{ type: String }],
        instructorDetails: { type: String }
    },
    // Stats and metrics
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    purchaseCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    // Additional metadata
    tags: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    isNewProduct: { type: Boolean, default: true },
    discount: { type: Number }, // Percentage discount
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Create indexes for search functionality
productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
