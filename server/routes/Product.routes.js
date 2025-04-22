// routes/Product.routes.js
import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    getProductStats,
    getRelatedProducts,
    getFeaturedProducts,
    getCoursesBySearch,
} from '../controllers/Product.js';
import { authMiddleware, requireApprovedSeller, authorizeRoles } from '../middlewares/auth.js';

const ProductRoutes = express.Router();

// Public routes
ProductRoutes.get('/', getProducts);
ProductRoutes.get('/search/courses', getCoursesBySearch);
ProductRoutes.get('/featured', getFeaturedProducts);
ProductRoutes.get('/:id', getProductById);
ProductRoutes.get('/:id/related', getRelatedProducts);

// Protected routes - sellers only
ProductRoutes.post('/', authMiddleware, requireApprovedSeller, createProduct);
ProductRoutes.put('/:id', authMiddleware, requireApprovedSeller, updateProduct);
ProductRoutes.delete('/:id', authMiddleware, authorizeRoles('seller', 'admin'), deleteProduct);
ProductRoutes.get('/seller/products', authMiddleware, authorizeRoles('seller'), getSellerProducts);
ProductRoutes.get('/:id/stats', authMiddleware, authorizeRoles('seller', 'admin'), getProductStats);

export default ProductRoutes;
