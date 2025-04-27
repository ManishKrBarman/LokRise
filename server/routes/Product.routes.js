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
    getAllCategories,
} from '../controllers/Product.js';

import {
    authMiddleware,
    requireApprovedSeller,
    authorizeRoles,
} from '../middlewares/auth.js';

const router = express.Router();

// ----------- PUBLIC ROUTES -----------
router.get('/', getProducts); // All products
router.get('/categories', getAllCategories); // Get all product categories
router.get('/search/courses', getCoursesBySearch); // Search courses
router.get('/featured', getFeaturedProducts); // Featured products
router.get('/:id/related', getRelatedProducts); // Related products by product ID
router.get('/:id', getProductById); // Get product by ID

// ----------- PROTECTED ROUTES -----------

// Seller-only: Get all their products
router.get('/seller/products',
    authMiddleware,
    authorizeRoles('seller'),
    getSellerProducts
);

// Seller or Admin: Product statistics
router.get('/:id/stats',
    authMiddleware,
    authorizeRoles('seller', 'admin'),
    getProductStats
);

// Seller-only: Create new product
router.post('/',
    authMiddleware,
    requireApprovedSeller,
    createProduct
);

// Seller-only: Update product
router.patch('/:id',
    authMiddleware,
    requireApprovedSeller,
    updateProduct
);

// Seller or Admin: Delete product
router.delete('/:id',
    authMiddleware,
    authorizeRoles('seller', 'admin'),
    deleteProduct
);

export default router;