import Order from '../models/order.js';

export const placeOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('buyer', 'name')
            .populate('seller', 'name')
            .populate('products.product', 'name price');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};