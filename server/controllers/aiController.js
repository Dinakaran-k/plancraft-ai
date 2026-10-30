const prisma = require('../services/prismaClient');
const { validateAiConsultInput, sanitizeString } = require('../services/validatorService');
const { consultAiCoPilot, generateMoreIdeas } = require('../services/geminiService');

/**
 * Hero Feature 2: Interactive AI Planning Co-Pilot
 * Provides real-time event advice, tradeoff analysis, and creative suggestions.
 */
async function consultAi(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId },
      include: {
        budgetItems: true,
        timelineItems: true,
        vendorItems: true
      }
    });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    const validation = validateAiConsultInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const { query } = validation.data;
    const { reply, aiStatus } = await consultAiCoPilot(event, query);

    // Save consultation history
    const savedConsult = await prisma.aiConsultation.create({
      data: {
        eventId: event.id,
        query,
        reply
      }
    });

    res.json({
      consultation: savedConsult,
      aiStatus
    });
  } catch (err) {
    next(err);
  }
}

async function addPersonalizedIdea(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const { title, description, category, costTier } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Idea title is required' });
    }

    const item = await prisma.personalizedIdea.create({
      data: {
        eventId,
        title: sanitizeString(title, 120),
        description: sanitizeString(description || '', 600),
        category: sanitizeString(category || 'THEME_DECOR', 50).toUpperCase(),
        costTier: sanitizeString(costTier || 'MEDIUM', 20).toUpperCase(),
        isSaved: true
      }
    });

    res.status(201).json({ idea: item });
  } catch (err) {
    next(err);
  }
}

async function deletePersonalizedIdea(req, res, next) {
  try {
    const { itemId } = req.params;
    const idea = await prisma.personalizedIdea.findUnique({
      where: { id: itemId },
      include: { event: true }
    });
    if (!idea || idea.event.sessionId !== req.sessionId) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    await prisma.personalizedIdea.delete({ where: { id: itemId } });
    res.json({ success: true, message: 'Idea removed' });
  } catch (err) {
    next(err);
  }
}

async function generateMoreIdeasController(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await prisma.event.findFirst({
      where: { id: eventId, sessionId: req.sessionId },
      include: { personalizedIdeas: true }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const existingTitles = (event.personalizedIdeas || []).map((i) => i.title);
    const { ideas, aiStatus } = await generateMoreIdeas(event, existingTitles);

    // Efficient atomic batch persistence via single transaction pipeline
    const insertOperations = ideas.map((idea) =>
      prisma.personalizedIdea.create({
        data: {
          eventId: event.id,
          title: sanitizeString(idea.title || 'Creative Idea', 120),
          description: sanitizeString(idea.description || '', 600),
          category: sanitizeString(idea.category || 'THEME_DECOR', 50).toUpperCase(),
          costTier: sanitizeString(idea.costTier || 'MEDIUM', 20).toUpperCase(),
          isSaved: true
        }
      })
    );

    const createdIdeas =
      insertOperations.length > 0 ? await prisma.$transaction(insertOperations) : [];

    res.status(201).json({
      ideas: createdIdeas,
      aiStatus
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  consultAi,
  addPersonalizedIdea,
  deletePersonalizedIdea,
  generateMoreIdeas: generateMoreIdeasController
};
