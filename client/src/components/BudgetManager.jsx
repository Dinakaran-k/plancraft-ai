import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, CheckCircle2, Circle, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'VENUE',
  'CATERING',
  'DECOR',
  'ENTERTAINMENT',
  'MEDIA',
  'LOGISTICS',
  'CONTINGENCY',
  'OTHER'
];

export default function BudgetManager({
  event,
  summary,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  currency = 'USD'
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CATERING');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [notes, setNotes] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      category,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      notes: notes.trim() || null
    });

    setTitle('');
    setEstimatedCost('');
    setActualCost('');
    setNotes('');
    setIsAdding(false);
  };

  const totalBudget = summary?.totalBudget || event.totalBudget || 0;
  const totalEstimated = summary?.totalEstimated || 0;
  const totalActual = summary?.totalActual || 0;
  const remainingBudget = summary?.remainingBudget ?? (totalBudget - totalEstimated);
  const percentSpent = summary?.percentSpent || 0;
  const isOverBudget = summary?.isOverBudget || false;

  return (
    <div className="space-y-6">
      {/* Top Analytical Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Allocated Budget</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalBudget)}</div>
          <div className="text-xs text-slate-400 mt-1">Master cap set for event</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Total</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalEstimated)}</div>
          <div className="text-xs text-brand-600 mt-1 font-medium">
            {totalBudget > 0 ? `${Math.round((totalEstimated / totalBudget) * 100)}% of total budget` : '0%'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Spent / Paid</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalActual)}</div>
          <div className="text-xs text-slate-400 mt-1">Confirmed payments</div>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${
          isOverBudget
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="text-xs font-semibold uppercase tracking-wider">
            {isOverBudget ? 'Over Budget By' : 'Remaining Balance'}
          </div>
          <div className="text-2xl font-bold mt-1">
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
          <div className="text-xs mt-1 font-medium">
            {isOverBudget ? '⚠️ Adjust categories to balance' : 'Available for contingencies'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-800 mb-2">
          <span>Budget Utilization</span>
          <span>{percentSpent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget
                ? 'bg-rose-500'
                : percentSpent > 85
                ? 'bg-amber-500'
                : 'bg-brand-500'
            }`}
            style={{ width: `${Math.min(100, percentSpent)}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown Badges */}
      {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Category Allocations
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summary.categoryBreakdown.map((c) => (
              <div key={c.category} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div className="text-xs font-semibold text-slate-600">{c.category}</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{formatCurrency(c.estimated)}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.percentageOfBudget}% of budget</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Budget Line Items</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track every item from initial quote to final settlement.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Add Form Dropdown */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="item-title" className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
              <input
                id="item-title"
                type="text"
                required
                placeholder="e.g. Centerpiece Florals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label htmlFor="item-category" className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="item-estimated-cost" className="block text-xs font-semibold text-slate-600 mb-1">Est. Cost</label>
              <input
                id="item-estimated-cost"
                type="number"
                placeholder="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                Save Item
              </button>
            </div>
          </form>
        )}

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {event.budgetItems && event.budgetItems.length > 0 ? (
            event.budgetItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => onUpdateItem(item.id, { isPaid: !item.isPaid })}
                    className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors"
                    aria-label={item.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                  >
                    {item.isPaid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-semibold ${item.isPaid ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                        {item.category}
                      </span>
                    </div>
                    {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.actualCost > 0 ? item.actualCost : item.estimatedCost)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.actualCost > 0 ? `Est: ${formatCurrency(item.estimatedCost)}` : 'Estimated'}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No budget items recorded yet. Click "Add Item" above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
