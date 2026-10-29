const express = require('express');
const router = express.Router();
const vendorsController = require('../controllers/vendorsController');

// POST /api/events/:eventId/vendors - Add vendor
router.post('/events/:eventId/vendors', vendorsController.addVendorItem);

// PUT /api/vendors/:itemId - Update vendor
router.put('/:itemId', vendorsController.updateVendorItem);

// DELETE /api/vendors/:itemId - Delete vendor
router.delete('/:itemId', vendorsController.deleteVendorItem);

module.exports = router;
