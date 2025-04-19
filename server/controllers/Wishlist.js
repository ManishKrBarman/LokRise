// controllers/Wishlist.js
import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id })
            .populate('items.product', 'name price images');

        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, items: [] });
            await wishlist.save();
        }

        res.status(200).json({ items: wishlist.items });
    } catch (err) {
        console.error('Get wishlist error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user.id, items: [] });
        }

        // Check if product already in wishlist
        const existingItem = wishlist.items.find(item =>
            item.product.toString() === productId);

        if (!existingItem) {
            wishlist.items.push({ product: productId });
            await wishlist.save();
        }

        await wishlist.populate('items.product', 'name price images');
        res.status(200).json({ items: wishlist.items });
    } catch (err) {
        console.error('Add to wishlist error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item =>
            item.product.toString() !== productId);

        await wishlist.save();
        await wishlist.populate('items.product', 'name price images');

        res.status(200).json({ items: wishlist.items });
    } catch (err) {
        console.error('Remove from wishlist error:', err);
        res.status(500).json({ message: err.message });
    }
};