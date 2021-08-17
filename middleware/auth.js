const asyncHander = require('../utils/asyncHander');
const ErrorResponse = require('../utils/ErrorResponse');

const authService = require('../services/auth');

const jwt = require('jsonwebtoken');

const ERROR_RESPONSE = {
  UNAUTHORIZED: new ErrorResponse({
    statusCode: 401,
    message: 'Invalid credentials. Please login and try again.',
  }),
  NOT_FOUND: new ErrorResponse({
    statusCode: 404,
    message: 'User not found.',
  }),
};

/**
 * Verifies JWT token and appends the associated user to res.locals.
 */
exports.verifyToken = asyncHander(async (req, res, next) => {
  let token = req.header('Authorization') || '';
  if (!token.includes('Bearer ')) {
    return next(ERROR_RESPONSE.UNAUTHORIZED);
  }
  token = token.split('Bearer ')[1];

  if (!token) {
    return next(ERROR_RESPONSE.UNAUTHORIZED);
  }

  const payload = await verifyJwt(token, process.env.JWT_SECRET);
  const user = await authService.findUserById(payload.id);
  if (user) {
    res.locals.user = user;
    return next();
  } else {
    return next(ERROR_RESPONSE.NOT_FOUND);
  }
});

/**
 * Helper function to promisify the JWT callback style API.
 */
function verifyJwt(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) {
        reject(ERROR_RESPONSE.UNAUTHORIZED);
      } else {
        resolve(payload);
      }
    });
  });
}
