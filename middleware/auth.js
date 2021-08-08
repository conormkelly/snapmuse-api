const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

const ERROR_RESPONSE = {
  UNAUTHORIZED: new ErrorResponse({
    statusCode: 401,
    message: 'Please provide a valid bearer token.',
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
      User.findByPk(payload.id)
        .then((user) => {
          res.locals.user = user;
          return next();
        })
        .catch((err) => {
          console.log(`Error while finding user: ${err.message}`);
          return next(ERROR_RESPONSE.UNAUTHORIZED);
        });
    }
  });
}

module.exports = { verifyToken };
