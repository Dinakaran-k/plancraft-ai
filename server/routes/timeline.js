const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');

// POST /api/events/:eventId/timeline - Add timeline item
router.post('/events/:eventId/timeline', timelineController.addTimelineItem);

// PUT /api/timeline/:itemId - Update item
router.put('/:itemId', timelineController.updateTimelineItem);

// PATCH /api/timeline/:itemId/toggle - Toggle completed status
router.patch('/:itemId/toggle', timelineController.toggleTimelineCompleted);

// DELETE /api/timeline/:itemId - Delete item
router.delete('/:itemId', timelineController.deleteTimelineItem);

module.exports = router;
