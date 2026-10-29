const prisma = require('../services/prismaClient');
const { validateVendorItemInput } = require('../services/validatorService');

async function addVendorItem(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const validation = validateVendorItemInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const item = await prisma.vendorItem.create({
      data: {
        ...validation.data,
        eventId
      }
    });

    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

async function updateVendorItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.vendorItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Vendor item not found' });
    }

    const validation = validateVendorItemInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const updated = await prisma.vendorItem.update({
      where: { id: itemId },
      data: validation.data
    });

    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteVendorItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.vendorItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Vendor item not found' });
    }

    await prisma.vendorItem.delete({ where: { id: itemId } });
    res.json({ success: true, message: 'Vendor item deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { addVendorItem, updateVendorItem, deleteVendorItem };
