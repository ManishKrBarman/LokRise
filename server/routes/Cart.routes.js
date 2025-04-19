// routes/Cart.routes.js
import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/Cart.js';

const CartRoutes = express.Router();

// All cart routes require authentication
CartRoutes.use(authMiddleware);

CartRoutes.get('/', getCart);
CartRoutes.post('/', addToCart);
CartRoutes.put('/', updateCartItem);
CartRoutes.delete('/:productId', removeFromCart);
CartRoutes.delete('/', clearCart);

export default CartRoutes;