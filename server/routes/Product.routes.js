// routes/Product.routes.js
import express from 'express';
import { createProduct, getProducts, getProductById } from '../controllers/Product.js';

const ProductRoutes = express.Router();

ProductRoutes.post('/', createProduct);
ProductRoutes.get('/', getProducts);
ProductRoutes.get('/:id', getProductById); // Get a product by ID

export default ProductRoutes;
