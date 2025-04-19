// routes/Wishlist.routes.js
import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} from '../controllers/Wishlist.js';

const WishlistRoutes = express.Router();

// All wishlist routes require authentication
WishlistRoutes.use(authMiddleware);

WishlistRoutes.get('/', getWishlist);
WishlistRoutes.post('/', addToWishlist);
WishlistRoutes.delete('/:productId', removeFromWishlist);

export default WishlistRoutes;