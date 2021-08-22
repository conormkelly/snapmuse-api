// Configures the Express API

const express = require('express');
const app = express();

// Import middleware
const helmet = require('helmet');
const cors = require("cors");
const invalidJSONBodyHandler = require('./middleware/invalidJSONBodyHandler');
const invalidRouteHandler = require('./middleware/invalidRouteHandler');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const routes = require('./routes/main');

// Configure middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(invalidJSONBodyHandler);


// Add routes
app.use('/api', routes);
// Handle 404s
app.use(invalidRouteHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
