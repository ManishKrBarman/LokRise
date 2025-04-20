// app.js
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './libs/db.js';
import AuthRoutes from './routes/Auth.routes.js';
import PayRoutes from './routes/Pay.routes.js';
import ProductRoutes from './routes/Product.routes.js';
import OrderRoutes from './routes/Order.routes.js';
import AdminRoutes from './routes/Admin.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import ChatRoutes from './routes/Chat.routes.js';
import CartRoutes from './routes/Cart.routes.js';
import WishlistRoutes from './routes/Wishlist.routes.js';
import { verifyTransporter } from './middlewares/email.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
const validateEnv = () => {
    const required = [
        'MONGO_URI',
        'JWT_SECRET',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASSWORD',
        'EMAIL_FROM',
        'GROQ_API_KEY'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Removed static files middleware - no longer serving files from public folder

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Content-Length'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS and cache headers for profile images
app.use('/auth/profile-image/:userId', (req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});

// Routes
app.use('/auth', AuthRoutes);
app.use('/payment', PayRoutes);
app.use('/products', ProductRoutes);
app.use('/orders', OrderRoutes);
app.use('/admin', AdminRoutes);
app.use('/chat', ChatRoutes);
app.use('/cart', CartRoutes);
app.use('/wishlist', WishlistRoutes);

app.use(errorHandler);

// 404 - Returning JSON instead of HTML file
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found'
    });
});

// Basic routes for testing
app.get('/about', (req, res) => {
    res.json({ message: 'Welcome to the LokRise API' });
});

app.get('/test-email', async (req, res) => {
    try {
        const result = await verifyTransporter();
        res.json({
            success: true,
            message: 'Email configuration test',
            emailConfigured: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email configuration test failed',
            error: error.message
        });
    }
});

// Connect to DB and start server
async function startServer() {
    try {
        // Validate environment variables
        validateEnv();

        // Connect to database
        await connectDB();
        console.log('Connected to MongoDB');

        // Verify email configuration
        const emailConfigured = await verifyTransporter();
        console.log(`Email configuration ${emailConfigured ? 'successful' : 'failed'}`);

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();