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
import { errorHandler } from './middlewares/errorHandler.js';
import ChatRoutes from './routes/Chat.routes.js';
import { verifyTransporter } from './middlewares/email.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, './public')));
app.use(cors());
// Routes
app.use('/auth', AuthRoutes);
app.use('/payment', PayRoutes);
app.use('/products', ProductRoutes);
app.use('/orders', OrderRoutes);
app.use('/chat', ChatRoutes);

app.use(errorHandler);

// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../temp/404.html'));
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