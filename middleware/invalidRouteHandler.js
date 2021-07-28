/**
 * 404 handler that sends a JSON response.
 */
function invalidRouteHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
}

module.exports = invalidRouteHandler;
