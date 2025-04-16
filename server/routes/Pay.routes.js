// routes/Pay.routes.js
import express from 'express';
import { payment } from '../controllers/Pay.js';

const PayRoutes = express.Router();
PayRoutes.post('/payment', payment);

export default PayRoutes;