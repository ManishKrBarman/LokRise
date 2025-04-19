// controllers/Cart.js
import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Get user's cart
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name price images quantityAvailable');

        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
            await cart.save();
        }

        res.status(200).json({ items: cart.items });
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Validate product exists and has sufficient inventory
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantityAvailable < quantity) {
            return res.status(400).json({ message: 'Insufficient inventory' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item =>
            item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        // Populate product details before sending response
        await cart.populate('items.product', 'name price images quantityAvailable');

        res.status(200).json({ items: cart.items });
    } catch (err) {
        console.error('Add to cart error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantityAvailable < quantity) {
            return res.status(400).json({ message: 'Insufficient inventory' });
        }

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price images quantityAvailable');

        res.status(200).json({ items: cart.items });
    } catch (err) {
        console.error('Update cart item error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item =>
            item.product.toString() !== productId);

        await cart.save();
        await cart.populate('items.product', 'name price images quantityAvailable');

        res.status(200).json({ items: cart.items });
    } catch (err) {
        console.error('Remove from cart error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ items: [] });
    } catch (err) {
        console.error('Clear cart error:', err);
        res.status(500).json({ message: err.message });
    }
};