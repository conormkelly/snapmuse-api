// Configures the Express API

const express = require('express');
const app = express();

// Import middleware
const invalidJSONBodyHandler = require('./middleware/invalidJSONBodyHandler');
const invalidRouteHandler = require('./middleware/invalidRouteHandler');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes/main');

// Configure middleware
app.use(express.json());
app.use(invalidJSONBodyHandler);

// TODO: add security middleware

// Add routes
app.use(routes);
// Handle 404s
app.use(invalidRouteHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
