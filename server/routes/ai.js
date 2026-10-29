const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { aiGenerationLimiter } = require('../middleware/rateLimiter');

// POST /api/events/:eventId/ai-consult - Hero interactive AI consult
router.post('/events/:eventId/ai-consult', aiGenerationLimiter, aiController.consultAi);

// POST /api/events/:eventId/ideas - Add custom idea
router.post('/events/:eventId/ideas', aiController.addPersonalizedIdea);

// DELETE /api/ideas/:itemId - Remove idea
router.delete('/ideas/:itemId', aiController.deletePersonalizedIdea);

module.exports = router;
