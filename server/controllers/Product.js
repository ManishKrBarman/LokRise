// controllers/Product.js
import mongoose from 'mongoose';
import Product from '../models/product.js';

export const createProduct = async (req, res) => {
    try {

        const { seller, name, description, price, quantityAvailable, category, images, location } = req.body;
        if (!mongoose.Types.ObjectId.isValid(seller)) {
            return res.status(400).json({ error: "Invalid seller ID" });
        }
        const product = new Product({
            seller: new mongoose.Types.ObjectId(seller),
            name,
            description,
            price,
            quantityAvailable,
            category,
            images,
            location
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
