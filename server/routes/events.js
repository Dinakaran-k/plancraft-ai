const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const aiController = require('../controllers/aiController');
const { aiGenerationLimiter } = require('../middleware/rateLimiter');

// GET /api/events - List user events
router.get('/', eventsController.listEvents);

// POST /api/events - Create manual event
router.post('/', eventsController.createEvent);

// POST /api/events/generate-plan - Hero AI Blueprint generation
router.post('/generate-plan', aiGenerationLimiter, eventsController.generateEventPlan);

// POST /api/events/:eventId/ai-consult - Hero interactive AI consult
router.post('/:eventId/ai-consult', aiGenerationLimiter, aiController.consultAi);

// POST /api/events/:eventId/more-ideas - Generate fresh bespoke ideas
router.post('/:eventId/more-ideas', aiGenerationLimiter, aiController.generateMoreIdeas);

// GET /api/events/:id - Get detailed event
router.get('/:id', eventsController.getEventById);

// PUT /api/events/:id - Update event details
router.put('/:id', eventsController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
