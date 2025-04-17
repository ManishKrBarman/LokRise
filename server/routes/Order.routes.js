import express from 'express';
import { placeOrder, getOrders } from '../controllers/Order.js';

const OrderRoutes = express.Router();

OrderRoutes.post('/', placeOrder);
OrderRoutes.get('/', getOrders);

export default OrderRoutes;