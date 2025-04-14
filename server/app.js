const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client/public
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/styles', express.static(path.join(__dirname, '../client/src/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../client/src/scripts')));


// Routes
// Send index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// Registration route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/register.html'));
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/login.html'));
});

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/about.html'));
});

// Error handler for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../client/public/404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});