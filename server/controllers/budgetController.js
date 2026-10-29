const prisma = require('../services/prismaClient');
const { validateBudgetItemInput } = require('../services/validatorService');

async function addBudgetItem(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const validation = validateBudgetItemInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const item = await prisma.budgetItem.create({
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

async function updateBudgetItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Budget item not found' });
    }

    const validation = validateBudgetItemInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const updated = await prisma.budgetItem.update({
      where: { id: itemId },
      data: validation.data
    });

    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteBudgetItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const item = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!item || item.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Budget item not found' });
    }

    await prisma.budgetItem.delete({ where: { id: itemId } });
    res.json({ success: true, message: 'Budget item deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { addBudgetItem, updateBudgetItem, deleteBudgetItem };
