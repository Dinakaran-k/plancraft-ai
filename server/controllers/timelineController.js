const prisma = require('../services/prismaClient');
const { validateTimelineItemInput } = require('../services/validatorService');

async function addTimelineItem(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const validation = validateTimelineItemInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const item = await prisma.timelineItem.create({
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

async function updateTimelineItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.timelineItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }

    const validation = validateTimelineItemInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const updated = await prisma.timelineItem.update({
      where: { id: itemId },
      data: validation.data
    });

    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

async function toggleTimelineCompleted(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.timelineItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }

    const updated = await prisma.timelineItem.update({
      where: { id: itemId },
      data: { isCompleted: !item.isCompleted }
    });

    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteTimelineItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.timelineItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }

    await prisma.timelineItem.delete({ where: { id: itemId } });
    res.json({ success: true, message: 'Timeline item deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addTimelineItem,
  updateTimelineItem,
  toggleTimelineCompleted,
  deleteTimelineItem
};
