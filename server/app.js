import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './libs/db.js';
import AuthRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../client/public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/register.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/login.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/about.html'));
});
app.use('/auth', AuthRoutes);




// 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../client/public/404.html'));
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});