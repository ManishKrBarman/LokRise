const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from client/public
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/styles', express.static(path.join(__dirname, '../client/src/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../client/src/scripts')));

// Send index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});