const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // Log server-side with stack for debugging
  console.error('[SERVER_ERROR]', err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload in request body' });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed by CORS policy' });
  }

  // Safe client response - never leak internal stack traces
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Server error';

  res.status(statusCode).json({ error: message });
}

module.exports = { errorHandler };
