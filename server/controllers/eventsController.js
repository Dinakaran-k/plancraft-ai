const prisma = require('../services/prismaClient');
const { validateEventInput } = require('../services/validatorService');
const { generateEventBlueprint } = require('../services/geminiService');
const { computeEventSummary } = require('../services/budgetStatsService');

async function listEvents(req, res, next) {
  try {
    const events = await prisma.event.findMany({
      where: { sessionId: req.sessionId },
      include: {
        budgetItems: true,
        timelineItems: true,
        vendorItems: true,
        personalizedIdeas: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const enriched = events.map((ev) => ({
      ...ev,
      summary: computeEventSummary(ev)
    }));

    res.json({ events: enriched });
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const { id } = req.params;
    const event = await prisma.event.findFirst({
      where: { id, sessionId: req.sessionId },
      include: {
        budgetItems: { orderBy: { createdAt: 'asc' } },
        timelineItems: { orderBy: { orderIndex: 'asc' } },
        vendorItems: { orderBy: { createdAt: 'asc' } },
        personalizedIdeas: { orderBy: { createdAt: 'asc' } },
        consultations: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const summary = computeEventSummary(event);
    res.json({ event: { ...event, summary } });
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const validation = validateEventInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const newEvent = await prisma.event.create({
      data: {
        ...validation.data,
        sessionId: req.sessionId
      }
    });

    res.status(201).json({ event: newEvent });
  } catch (err) {
    next(err);
  }
}

/**
 * Hero Feature: Generate complete event plan via Gemini 2.5 Flash
 * Synthesizes budget, timeline, vendors, and personalized ideas in one atomic persistence.
 */
async function generateEventPlan(req, res, next) {
  try {
    const validation = validateEventInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    // Call Gemini Service
    const { blueprint, aiStatus } = await generateEventBlueprint(validation.data);

    // Save event + all blueprint items atomically
    const createdEvent = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          ...validation.data,
          sessionId: req.sessionId,
          aiOverview: blueprint.aiOverview,
          aiThemeConcept: blueprint.aiThemeConcept
        }
      });

      // Insert budget items
      if (blueprint.budgetPlan && blueprint.budgetPlan.length > 0) {
        await tx.budgetItem.createMany({
          data: blueprint.budgetPlan.map((b) => ({
            eventId: event.id,
            category: b.category || 'OTHER',
            title: b.title || 'Budget Item',
            estimatedCost: Number(b.estimatedCost) || 0,
            actualCost: 0,
            notes: b.notes || null
          }))
        });
      }

      // Insert timeline items
      if (blueprint.timelinePlan && blueprint.timelinePlan.length > 0) {
        await tx.timelineItem.createMany({
          data: blueprint.timelinePlan.map((t, index) => ({
            eventId: event.id,
            phase: t.phase || 'EARLY_PLANNING',
            title: t.title || 'Milestone',
            time: t.time || null,
            notes: t.notes || null,
            orderIndex: index
          }))
        });
      }

      // Insert vendor items
      if (blueprint.vendorPlan && blueprint.vendorPlan.length > 0) {
        await tx.vendorItem.createMany({
          data: blueprint.vendorPlan.map((v) => ({
            eventId: event.id,
            category: v.category || 'OTHER',
            vendorName: v.vendorName || 'Vendor',
            aiScreeningTips: v.aiScreeningTips || null,
            status: 'NOT_CONTACTED'
          }))
        });
      }

      // Insert personalized ideas
      if (blueprint.personalizedIdeas && blueprint.personalizedIdeas.length > 0) {
        await tx.personalizedIdea.createMany({
          data: blueprint.personalizedIdeas.map((idea) => ({
            eventId: event.id,
            category: idea.category || 'THEME_DECOR',
            title: idea.title || 'Creative Idea',
            description: idea.description || '',
            costTier: idea.costTier || 'MEDIUM',
            isSaved: true
          }))
        });
      }

      return event;
    });

    // Fetch the full event with its relations and stats
    const fullEvent = await prisma.event.findUnique({
      where: { id: createdEvent.id },
      include: {
        budgetItems: true,
        timelineItems: { orderBy: { orderIndex: 'asc' } },
        vendorItems: true,
        personalizedIdeas: true,
        consultations: true
      }
    });

    const summary = computeEventSummary(fullEvent);

    res.status(201).json({
      event: { ...fullEvent, summary },
      aiStatus,
      message:
        aiStatus === 'SUCCESS'
          ? 'AI Event Blueprint successfully crafted!'
          : 'Event created using resilient blueprint templates.'
    });
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findFirst({
      where: { id, sessionId: req.sessionId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const validation = validateEventInput(req.body, true);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: validation.data
    });

    res.json({ event: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.event.findFirst({
      where: { id, sessionId: req.sessionId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Event successfully removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEvents,
  getEventById,
  createEvent,
  generateEventPlan,
  updateEvent,
  deleteEvent
};
