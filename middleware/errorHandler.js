const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Centralized error handler for returning sanitized error messages to the client.
 */
function errorHandler(err, req, res, next) {
  // Check if known error
  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Return 500 with stock message, to prevent leaking errors to the client
  return res.status(500).json({
    success: false,
    message: "We're sorry, an unknown error has occurred. Please try again.",
  });
}

module.exports = errorHandler;
