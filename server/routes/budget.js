const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

// POST /api/events/:eventId/budget - Add budget line item
router.post('/events/:eventId/budget', budgetController.addBudgetItem);

// PUT /api/budget/:itemId - Update item
router.put('/:itemId', budgetController.updateBudgetItem);

// DELETE /api/budget/:itemId - Remove item
router.delete('/:itemId', budgetController.deleteBudgetItem);

module.exports = router;
