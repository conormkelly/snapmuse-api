const express = require('express');
const app = express();

// Import routes
const routes = require('./routes/main');

// TODO: add security middleware

// Add routes
app.use(routes);

// TODO: add 404, error handler middleware

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

module.exports = app;
