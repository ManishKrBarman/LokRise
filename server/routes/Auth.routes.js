import express from 'express';
import { register, verifyEmail, registerSeller } from '../controllers/Auth.js';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register)
AuthRoutes.post('/verify-email', verifyEmail)
AuthRoutes.post('/seller/register', registerSeller)
export default AuthRoutes;