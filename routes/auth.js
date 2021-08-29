const express = require('express');
const authRouter = express.Router();

// Middleware
const validationMiddleware = require('../middleware/validation');

// Add controller methods
const { register, login, logout } = require('../controllers/auth');

// Associate controllers with routes
authRouter.post('/register', validationMiddleware.register, register);
authRouter.post('/login', validationMiddleware.login, login);
authRouter.post('/logout', logout);

module.exports = authRouter;
