// models/category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: { type: String },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    ancestors: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String },
        slug: { type: String }
    }],
    icon: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
    displayOrder: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    showOnHomepage: { type: Boolean, default: false },
    showInNavigation: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Middleware to generate slug from name
categorySchema.pre('save', function (next) {
    if (!this.isModified('name')) return next();
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;