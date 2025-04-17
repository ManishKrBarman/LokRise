// app.js
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './libs/db.js';
import AuthRoutes from './routes/Auth.routes.js';
import PayRoutes from './routes/Pay.routes.js';
import ProductRoutes from './routes/Product.routes.js';
import OrderRoutes from './routes/Order.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './public/register.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './public/login.html'));
});
app.get("/about", (req, res) => {
    res.json({ message: "This is the about route from backend!" });
});
app.use('/auth', AuthRoutes);
app.use('/payment', PayRoutes);
app.use('/products', ProductRoutes);
app.use('/orders', OrderRoutes);

app.use(errorHandler);

// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'temp/404.html'));
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});