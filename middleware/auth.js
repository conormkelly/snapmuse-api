const jwt = require('jsonwebtoken');
const authService = require('../services/auth');
const ErrorResponse = require('../utils/ErrorResponse');

const ERROR_RESPONSE = {
  UNAUTHORIZED: new ErrorResponse({
    statusCode: 401,
    message: 'Please provide a valid bearer token.',
  }),
  NOT_FOUND: new ErrorResponse({
    statusCode: 404,
    messages: 'User not found.',
  }),
};

/**
 * Verifies JWT token and appends the associated user to res.locals.
 */
function verifyToken(req, res, next) {
  let token = req.header('Authorization') || '';
  if (!token.includes('Bearer ')) {
    return next(ERROR_RESPONSE.UNAUTHORIZED);
  }
  token = token.split('Bearer ')[1];

  if (!token) {
    return next(ERROR_RESPONSE.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return next(ERROR_RESPONSE.UNAUTHORIZED);
    } else {
      authService
        .findUserById(payload.id)
        .then((user) => {
          if (user) {
            res.locals.user = user;
            return next();
          } else {
            return next(ERROR_RESPONSE.NOT_FOUND);
          }
        })
        .catch((err) => {
          console.log(`Error while finding user: ${err.message}`);
          return next(ERROR_RESPONSE.UNAUTHORIZED);
        });
    }
  });
}

module.exports = { verifyToken };
