const { cleanAndParseJSON, generateFallbackBlueprint } = require('../services/geminiService');

describe('Gemini Response Parser & Fallback Unit Tests', () => {
  test('parses clean valid JSON response', () => {
    const raw = JSON.stringify({
      aiOverview: 'A stunning sunset wedding celebration.',
      aiThemeConcept: 'Sunset Glow with peach and bronze accents.',
      budgetPlan: [{ category: 'VENUE', title: 'Garden Pavilion', estimatedCost: 2000 }],
      timelinePlan: [{ phase: 'DAY_OF', title: 'Ceremony Start', time: '17:00' }],
      vendorPlan: [{ category: 'PHOTOGRAPHY', vendorName: 'Lens Magic' }],
      personalizedIdeas: [{ category: 'FOOD_BEVERAGE', title: 'Sparkler Toast', costTier: 'LOW' }]
    });

    const parsed = cleanAndParseJSON(raw);
    expect(parsed.aiOverview).toContain('sunset wedding');
    expect(parsed.budgetPlan).toHaveLength(1);
    expect(parsed.timelinePlan).toHaveLength(1);
    expect(parsed.vendorPlan).toHaveLength(1);
    expect(parsed.personalizedIdeas).toHaveLength(1);
  });

  test('strips markdown backticks from model output safely', () => {
    const raw = '```json\n{\n  "aiOverview": "Markdown wrapped plan",\n  "aiThemeConcept": "Theme",\n  "budgetPlan": []\n}\n```';
    const parsed = cleanAndParseJSON(raw);
    expect(parsed.aiOverview).toBe('Markdown wrapped plan');
    expect(parsed.budgetPlan).toEqual([]);
  });

  test('throws error on non-JSON response', () => {
    expect(() => cleanAndParseJSON('Not a json string')).toThrow();
  });

  test('generateFallbackBlueprint returns complete structured plan for Weddings', () => {
    const fallback = generateFallbackBlueprint({
      eventType: 'WEDDING',
      guestCount: 100,
      totalBudget: 12000,
      currency: 'USD'
    });

    expect(fallback.aiOverview).toContain('wedding');
    expect(fallback.aiThemeConcept).toContain('Romance');
    expect(fallback.budgetPlan.length).toBeGreaterThan(3);
    expect(fallback.timelinePlan.length).toBeGreaterThan(4);
    expect(fallback.vendorPlan.length).toBeGreaterThan(2);
    expect(fallback.personalizedIdeas.length).toBeGreaterThan(1);
  });
});
