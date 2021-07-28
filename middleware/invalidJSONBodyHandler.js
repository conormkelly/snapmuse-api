const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Returns a formulated error response if express.json / bodyparser throws an error.
 */
function invalidJSONBodyHandler(err, req, res, next) {
  if (err && err instanceof SyntaxError && 'body' in err) {
    return next(
      new ErrorResponse({
        statusCode: 400,
        message: 'Invalid JSON body provided.',
      })
    );
  }
  next();
}

module.exports = invalidJSONBodyHandler;
