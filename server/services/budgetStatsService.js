/**
 * budgetStatsService.js
 * Computes live analytical aggregations for events:
 * - Budget totals, remaining balance, category distributions
 * - Timeline milestone completion percentages
 * - Vendor pipeline funnel metrics
 */

function computeEventSummary(event) {
  const totalBudget = Number(event.totalBudget) || 0;
  const budgetItems = event.budgetItems || [];
  const timelineItems = event.timelineItems || [];
  const vendorItems = event.vendorItems || [];

  // Budget calculations
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;
  const categoryMap = {};

  for (const item of budgetItems) {
    const est = Number(item.estimatedCost) || 0;
    const act = Number(item.actualCost) || 0;
    totalEstimated += est;
    totalActual += act;
    if (item.isPaid) {
      totalPaid += act > 0 ? act : est;
    }

    const cat = item.category || 'OTHER';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, estimated: 0, actual: 0, count: 0 };
    }
    categoryMap[cat].estimated += est;
    categoryMap[cat].actual += act;
    categoryMap[cat].count += 1;
  }

  const effectiveSpent = totalActual > 0 ? totalActual : totalEstimated;
  const remainingBudget = Math.max(0, totalBudget - effectiveSpent);
  const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((effectiveSpent / totalBudget) * 100)) : 0;
  const isOverBudget = effectiveSpent > totalBudget;

  const categoryBreakdown = Object.values(categoryMap).map((c) => ({
    ...c,
    estimated: Math.round(c.estimated * 100) / 100,
    actual: Math.round(c.actual * 100) / 100,
    percentageOfBudget: totalBudget > 0 ? Math.round((c.estimated / totalBudget) * 100) : 0
  }));

  // Timeline progress
  const totalMilestones = timelineItems.length;
  const completedMilestones = timelineItems.filter((t) => t.isCompleted).length;
  const timelinePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Vendor pipeline
  const vendorStatuses = {
    NOT_CONTACTED: 0,
    INQUIRED: 0,
    SHORTLISTED: 0,
    BOOKED: 0,
    CONFIRMED: 0
  };

  for (const v of vendorItems) {
    const st = v.status || 'NOT_CONTACTED';
    if (vendorStatuses[st] !== undefined) vendorStatuses[st] += 1;
  }

  return {
    totalBudget: Math.round(totalBudget * 100) / 100,
    totalEstimated: Math.round(totalEstimated * 100) / 100,
    totalActual: Math.round(totalActual * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    remainingBudget: Math.round(remainingBudget * 100) / 100,
    percentSpent,
    isOverBudget,
    categoryBreakdown,
    timelineStats: {
      total: totalMilestones,
      completed: completedMilestones,
      pending: totalMilestones - completedMilestones,
      percentComplete: timelinePercent
    },
    vendorStats: {
      total: vendorItems.length,
      byStatus: vendorStatuses
    }
  };
}

module.exports = { computeEventSummary };
