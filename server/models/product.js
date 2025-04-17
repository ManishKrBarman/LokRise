// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },
    category: { type: String },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // No need for `new` here
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
