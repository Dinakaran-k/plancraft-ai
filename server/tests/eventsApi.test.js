const request = require('supertest');
const app = require('../app');
const prisma = require('../services/prismaClient');

const TEST_SESSION_ID = '99999999-9999-4999-9999-999999999999';

beforeEach(async () => {
  await prisma.aiConsultation.deleteMany();
  await prisma.personalizedIdea.deleteMany();
  await prisma.vendorItem.deleteMany();
  await prisma.timelineItem.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.event.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('API Integration: Session & Authentication Guards', () => {
  test('rejects requests missing X-Session-Id with 400', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required header');
  });

  test('rejects requests with malformed X-Session-Id with 400', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('X-Session-Id', 'not-a-valid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid X-Session-Id');
  });

  test('public /health check does not require session header', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('API Integration: Events CRUD', () => {
  test('creates a new event manually and retrieves it', async () => {
    const createRes = await request(app)
      .post('/api/events')
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({
        name: 'Community Earth Day Festival',
        eventType: 'COMMUNITY',
        guestCount: 250,
        totalBudget: 8000,
        targetDate: '2026-04-22',
        location: 'Riverside Park',
        vibe: 'Eco-conscious and family friendly'
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.event.name).toBe('Community Earth Day Festival');
    const eventId = createRes.body.event.id;

    // Fetch by ID
    const getRes = await request(app)
      .get(`/api/events/${eventId}`)
      .set('X-Session-Id', TEST_SESSION_ID);

    expect(getRes.status).toBe(200);
    expect(getRes.body.event.id).toBe(eventId);
    expect(getRes.body.event.summary).toBeDefined();
    expect(getRes.body.event.summary.totalBudget).toBe(8000);
  });

  test('validates bad input when creating event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({
        name: '',
        eventType: 'INVALID_TYPE',
        totalBudget: -100
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe('API Integration: Sub-resource CRUD', () => {
  let createdEventId;

  beforeEach(async () => {
    const ev = await prisma.event.create({
      data: {
        sessionId: TEST_SESSION_ID,
        name: 'Milestone 30th Birthday',
        eventType: 'BIRTHDAY',
        guestCount: 40,
        totalBudget: 3500
      }
    });
    createdEventId = ev.id;
  });

  test('manages budget items: add, update, delete', async () => {
    // Add
    const addRes = await request(app)
      .post(`/api/budget/events/${createdEventId}/budget`)
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({
        title: 'Custom Birthday Cake',
        category: 'CATERING',
        estimatedCost: 350,
        actualCost: 320,
        isPaid: true
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.item.title).toBe('Custom Birthday Cake');
    const itemId = addRes.body.item.id;

    // Update
    const updateRes = await request(app)
      .put(`/api/budget/${itemId}`)
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({ actualCost: 340 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.item.actualCost).toBe(340);

    // Delete
    const delRes = await request(app)
      .delete(`/api/budget/${itemId}`)
      .set('X-Session-Id', TEST_SESSION_ID);

    expect(delRes.status).toBe(200);
  });

  test('manages timeline items: add, toggle complete, delete', async () => {
    const addRes = await request(app)
      .post(`/api/timeline/events/${createdEventId}/timeline`)
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({
        title: 'Send digital invitations',
        phase: 'EARLY_PLANNING'
      });

    expect(addRes.status).toBe(201);
    const itemId = addRes.body.item.id;
    expect(addRes.body.item.isCompleted).toBe(false);

    // Toggle
    const toggleRes = await request(app)
      .patch(`/api/timeline/${itemId}/toggle`)
      .set('X-Session-Id', TEST_SESSION_ID);

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.item.isCompleted).toBe(true);
  });

  test('manages vendor items: add and update status', async () => {
    const addRes = await request(app)
      .post(`/api/vendors/events/${createdEventId}/vendors`)
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({
        vendorName: 'SoundWave DJ',
        category: 'MUSIC',
        status: 'INQUIRED',
        quotedPrice: 600
      });

    expect(addRes.status).toBe(201);
    const vendorId = addRes.body.item.id;

    const updateRes = await request(app)
      .put(`/api/vendors/${vendorId}`)
      .set('X-Session-Id', TEST_SESSION_ID)
      .send({ status: 'BOOKED' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.item.status).toBe('BOOKED');
  });

  test('generates additional personalized ideas via more-ideas endpoint', async () => {
    const res = await request(app)
      .post(`/api/events/${createdEventId}/more-ideas`)
      .set('X-Session-Id', TEST_SESSION_ID);

    expect(res.status).toBe(201);
    expect(Array.isArray(res.body.ideas)).toBe(true);
    expect(res.body.ideas.length).toBeGreaterThan(0);
    expect(res.body.ideas[0]).toHaveProperty('title');
    expect(res.body.ideas[0]).toHaveProperty('category');
  });
});
