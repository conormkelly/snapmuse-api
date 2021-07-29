// Configures the Express API

const express = require('express');
const app = express();

// Import middleware
const cors = require("cors");
const invalidJSONBodyHandler = require('./middleware/invalidJSONBodyHandler');
const invalidRouteHandler = require('./middleware/invalidRouteHandler');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes/main');

// TODO: add security middleware
// Configure middleware
app.use(cors());
app.use(express.json());
app.use(invalidJSONBodyHandler);


// Add routes
app.use(routes);
// Handle 404s
app.use(invalidRouteHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
