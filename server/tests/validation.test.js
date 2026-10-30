const {
  validateUUID,
  validateEventInput,
  validateBudgetItemInput,
  validateTimelineItemInput,
  validateVendorItemInput,
  validateAiConsultInput,
  sanitizeString
} = require('../services/validatorService');
const { computeEventSummary } = require('../services/budgetStatsService');

describe('validatorService Unit Tests', () => {
  describe('UUID validation', () => {
    test('accepts valid UUID v4', () => {
      expect(validateUUID('a3bb189e-8bf9-4888-9912-ace4e6543002')).toBe(true);
    });

    test('rejects non-UUID strings', () => {
      expect(validateUUID('invalid-uuid')).toBe(false);
      expect(validateUUID('')).toBe(false);
      expect(validateUUID(null)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    test('strips HTML tags and trims whitespace', () => {
      expect(sanitizeString('  <b>Wedding Party</b>  ')).toBe('Wedding Party');
      expect(sanitizeString('<script>alert("hack")</script>Hello')).toBe('alert("hack")Hello');
    });

    test('enforces max length constraints', () => {
      const longStr = 'a'.repeat(300);
      expect(sanitizeString(longStr, 50).length).toBe(50);
    });
  });

  describe('validateEventInput', () => {
    test('validates complete correct event', () => {
      const res = validateEventInput({
        name: 'Sarah & John Wedding',
        eventType: 'WEDDING',
        guestCount: 120,
        totalBudget: 15000,
        targetDate: '2026-12-15'
      });
      expect(res.isValid).toBe(true);
      expect(res.data.name).toBe('Sarah & John Wedding');
      expect(res.data.eventType).toBe('WEDDING');
      expect(res.data.guestCount).toBe(120);
      expect(res.data.totalBudget).toBe(15000);
    });

    test('rejects missing or empty event name', () => {
      const res = validateEventInput({ name: '   ', eventType: 'WEDDING' });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('name is required');
    });

    test('rejects invalid eventType', () => {
      const res = validateEventInput({ name: 'Party', eventType: 'INVALID_TYPE' });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('eventType must be one of');
    });

    test('rejects negative budgets or invalid numbers', () => {
      const res = validateEventInput({
        name: 'Gala',
        eventType: 'COMMUNITY',
        guestCount: 100,
        totalBudget: -500
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.some((e) => e.includes('totalBudget must be a non-negative'))).toBe(true);
    });
  });

  describe('validateBudgetItemInput', () => {
    test('validates correct budget item', () => {
      const res = validateBudgetItemInput({
        title: 'Floral Arch',
        category: 'DECOR',
        estimatedCost: 650
      });
      expect(res.isValid).toBe(true);
      expect(res.data.title).toBe('Floral Arch');
      expect(res.data.estimatedCost).toBe(650);
    });

    test('rejects invalid category', () => {
      const res = validateBudgetItemInput({
        title: 'Item',
        category: 'SPORTS'
      });
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toContain('category must be one of');
    });
  });

  describe('validateTimelineItemInput', () => {
    test('validates correct timeline item', () => {
      const res = validateTimelineItemInput({
        title: 'Tasting appointment',
        phase: 'MID_PLANNING'
      });
      expect(res.isValid).toBe(true);
      expect(res.data.phase).toBe('MID_PLANNING');
    });
  });

  describe('validateVendorItemInput', () => {
    test('validates correct vendor item', () => {
      const res = validateVendorItemInput({
        vendorName: 'Apex DJ Services',
        category: 'MUSIC',
        status: 'INQUIRED'
      });
      expect(res.isValid).toBe(true);
      expect(res.data.status).toBe('INQUIRED');
    });
  });

  describe('validateAiConsultInput', () => {
    test('validates user inquiry query', () => {
      const res = validateAiConsultInput({ query: 'How can we cut 10% from catering?' });
      expect(res.isValid).toBe(true);
      expect(res.data.query).toContain('cut 10%');
    });

    test('rejects empty query', () => {
      const res = validateAiConsultInput({ query: '' });
      expect(res.isValid).toBe(false);
    });
  });
});

describe('budgetStatsService Unit Tests', () => {
  test('calculates accurate summary and category aggregations', () => {
    const mockEvent = {
      totalBudget: 10000,
      budgetItems: [
        { category: 'VENUE', estimatedCost: 4000, actualCost: 3800, isPaid: true },
        { category: 'CATERING', estimatedCost: 3500, actualCost: 0, isPaid: false },
        { category: 'DECOR', estimatedCost: 1500, actualCost: 1200, isPaid: true }
      ],
      timelineItems: [
        { isCompleted: true },
        { isCompleted: false },
        { isCompleted: true },
        { isCompleted: false }
      ],
      vendorItems: [{ status: 'BOOKED' }, { status: 'INQUIRED' }, { status: 'BOOKED' }]
    };

    const summary = computeEventSummary(mockEvent);

    expect(summary.totalBudget).toBe(10000);
    expect(summary.totalEstimated).toBe(9000);
    expect(summary.totalActual).toBe(5000);
    expect(summary.timelineStats.total).toBe(4);
    expect(summary.timelineStats.completed).toBe(2);
    expect(summary.timelineStats.percentComplete).toBe(50);
    expect(summary.vendorStats.byStatus.BOOKED).toBe(2);
    expect(summary.vendorStats.byStatus.INQUIRED).toBe(1);
    expect(summary.categoryBreakdown.length).toBe(3);
  });
});
