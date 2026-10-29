const { validateUUID } = require('../services/validatorService');

function requireSession(req, res, next) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    return res.status(400).json({
      error: 'Missing required header: X-Session-Id'
    });
  }

  if (!validateUUID(sessionId)) {
    return res.status(400).json({
      error: 'Invalid X-Session-Id format (must be a valid UUID v4)'
    });
  }

  req.sessionId = sessionId;
  next();
}

module.exports = { requireSession };
