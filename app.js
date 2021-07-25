// Configures the Express API
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import routes
const routes = require('./routes/main');

// TODO: add security middleware

// Add routes
app.use(routes);

// TODO: add 404, error handler middleware

module.exports = app;
