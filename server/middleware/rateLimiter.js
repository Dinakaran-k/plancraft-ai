const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes per IP
const standardApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});

// Stricter rate limiter for AI generation calls to prevent quota exhaustion
const aiGenerationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30, // 30 AI generations per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI generation limit reached for this session. Please wait a few minutes before generating more.' }
});

module.exports = { standardApiLimiter, aiGenerationLimiter };
