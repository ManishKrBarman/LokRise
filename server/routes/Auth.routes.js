import express from 'express';
import { register, verifyEmail } from '../controllers/Auth.js';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register)
AuthRoutes.post('/verify-email', verifyEmail)
export default AuthRoutes;