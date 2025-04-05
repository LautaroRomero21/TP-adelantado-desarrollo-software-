// app.js
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

module.exports = app;
