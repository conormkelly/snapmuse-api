const express = require('express');
const authRouter = express.Router();

// Auth middleware
const { verifyToken } = require('../middleware/auth');

// Add controller methods
const { register, login, logout } = require('../controllers/auth');

// Associate controllers with routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

module.exports = authRouter;
