/**
 * A function wrapper that acts as an implicit try catch for async controller methods.
 * Any errors caused by a rejected promise are passed to the `next` handler,
 * without crashing the application.
 */
module.exports = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
