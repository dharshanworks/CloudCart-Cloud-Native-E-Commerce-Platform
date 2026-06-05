/**
 * Async Handler
 * Wrapper to catch errors in async route handlers
 * This is a fallback/reference implementation
 * Primary implementation uses express-async-handler from npm
 */

export default (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
