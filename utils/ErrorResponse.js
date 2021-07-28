/**
 * Used to differentiate known errors in the API,
 * in order to prevent leaking errors in
 * the centralized error handler middleware.
 */
class ErrorResponse extends Error {
  constructor({ statusCode, message }) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
