const ErrorResponse = require('../utils/ErrorResponse');

/**
 * 404 handler that sends a JSON response.
 */
function invalidRouteHandler(req, res, next) {
  return next(
    new ErrorResponse({
      statusCode: 404,
      message: `Cannot ${req.method} ${req.url}`,
    })
  );
}

module.exports = invalidRouteHandler;
