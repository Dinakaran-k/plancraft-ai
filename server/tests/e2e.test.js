const request = require('supertest');
const app = require('../app');
const prisma = require('../services/prismaClient');

const E2E_SESSION_ID = 'e2ee2ee2-e2ee-4e2e-8e2e-e2ee2ee2ee2e';

beforeAll(async () => {
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

describe('E2E Full Event Planning Flow', () => {
  test('End-to-End: AI Blueprint Generation, Consultation, and Live Dashboard Tracking', async () => {
    // 1. User submits wedding plan request to AI generator
    const planRes = await request(app)
      .post('/api/events/generate-plan')
      .set('X-Session-Id', E2E_SESSION_ID)
      .send({
        name: 'Elena & Lucas Garden Wedding',
        eventType: 'WEDDING',
        guestCount: 150,
        totalBudget: 25000,
        targetDate: '2027-06-20',
        location: 'Botanical Gardens',
        vibe: 'Romantic, organic botanical, acoustic garden party',
        notes: 'Need plenty of vegetarian and dairy-free options.'
      });

    expect(planRes.status).toBe(201);
    expect(planRes.body.event).toBeDefined();
    expect(planRes.body.event.name).toBe('Elena & Lucas Garden Wedding');

    const event = planRes.body.event;
    const eventId = event.id;

    // 2. Verify all 4 required pillars are generated and persisted
    expect(event.budgetItems.length).toBeGreaterThan(0);
    expect(event.timelineItems.length).toBeGreaterThan(0);
    expect(event.vendorItems.length).toBeGreaterThan(0);
    expect(event.personalizedIdeas.length).toBeGreaterThan(0);
    expect(event.aiThemeConcept).toBeDefined();

    // 3. User interacts with AI Co-Pilot for contingency advice
    const consultRes = await request(app)
      .post(`/api/events/${eventId}/ai-consult`)
      .set('X-Session-Id', E2E_SESSION_ID)
      .send({
        query: 'What should our weather contingency plan be if it rains at the Botanical Gardens?'
      });

    expect(consultRes.status).toBe(200);
    expect(consultRes.body.consultation).toBeDefined();
    expect(consultRes.body.consultation.reply).toBeDefined();
    expect(consultRes.body.consultation.reply.length).toBeGreaterThan(20);

    // 4. User completes the first milestone
    const firstTimelineItem = event.timelineItems[0];
    const toggleRes = await request(app)
      .patch(`/api/timeline/${firstTimelineItem.id}/toggle`)
      .set('X-Session-Id', E2E_SESSION_ID);

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.item.isCompleted).toBe(true);

    // 5. User books a vendor
    const firstVendor = event.vendorItems[0];
    const vendorUpdateRes = await request(app)
      .put(`/api/vendors/${firstVendor.id}`)
      .set('X-Session-Id', E2E_SESSION_ID)
      .send({ status: 'BOOKED', quotedPrice: 4200 });

    expect(vendorUpdateRes.status).toBe(200);
    expect(vendorUpdateRes.body.item.status).toBe('BOOKED');

    // 6. User re-fetches dashboard: summary metrics reflect updates
    const fetchRes = await request(app)
      .get(`/api/events/${eventId}`)
      .set('X-Session-Id', E2E_SESSION_ID);

    expect(fetchRes.status).toBe(200);
    const updatedEvent = fetchRes.body.event;
    expect(updatedEvent.summary.timelineStats.completed).toBe(1);
    expect(updatedEvent.summary.vendorStats.byStatus.BOOKED).toBe(1);
    expect(updatedEvent.consultations.length).toBe(1);
  });
});
