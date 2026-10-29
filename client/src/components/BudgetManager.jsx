import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  PieChart as PieIcon,
  Edit2,
  X,
  Check
} from 'lucide-react';

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

const CATEGORY_COLORS = {
  VENUE: { bg: 'bg-indigoBrand-500', text: 'text-indigoBrand-700', hex: '#6366f1' },
  CATERING: { bg: 'bg-emerald-500', text: 'text-emerald-700', hex: '#10b981' },
  DECOR: { bg: 'bg-rose-500', text: 'text-rose-700', hex: '#f43f5e' },
  ENTERTAINMENT: { bg: 'bg-amber-500', text: 'text-amber-700', hex: '#f59e0b' },
  MEDIA: { bg: 'bg-sky-500', text: 'text-sky-700', hex: '#0ea5e9' },
  LOGISTICS: { bg: 'bg-purple-500', text: 'text-purple-700', hex: '#8b5cf6' },
  CONTINGENCY: { bg: 'bg-slate-500', text: 'text-slate-700', hex: '#64748b' },
  OTHER: { bg: 'bg-teal-500', text: 'text-teal-700', hex: '#14b8a6' }
};

export default function BudgetManager({
  event,
  summary,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  currency = 'USD'
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Form states for adding
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CATERING');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [notes, setNotes] = useState('');

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('CATERING');
  const [editEstimatedCost, setEditEstimatedCost] = useState('');
  const [editActualCost, setEditActualCost] = useState('');
  const [editNotes, setEditNotes] = useState('');

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

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditEstimatedCost(item.estimatedCost || '');
    setEditActualCost(item.actualCost || '');
    setEditNotes(item.notes || '');
  };

  const saveEdit = (id) => {
    onUpdateItem(id, {
      title: editTitle.trim(),
      category: editCategory,
      estimatedCost: Number(editEstimatedCost) || 0,
      actualCost: Number(editActualCost) || 0,
      notes: editNotes.trim() || null
    });
    setEditingItemId(null);
  };

  const totalBudget = summary?.totalBudget || event.totalBudget || 0;
  const totalEstimated = summary?.totalEstimated || 0;
  const totalActual = summary?.totalActual || 0;
  const remainingBudget = summary?.remainingBudget ?? (totalBudget - totalEstimated);
  const percentSpent = summary?.percentSpent || 0;
  const isOverBudget = summary?.isOverBudget || false;

  const rawItems = event.budgetItems || [];
  const filteredItems = filterCategory === 'ALL'
    ? rawItems
    : rawItems.filter((i) => i.category === filterCategory);

  const categoryBreakdown = summary?.categoryBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Analytical KPI Cards */}
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
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Spent / Settled</div>
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

      {/* Visual Category Distribution Stack Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-brand-600" />
              <span>Interactive Budget Category Visualization</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual proportion of overall budget allocated across major event domains.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            Budget Utilization: {percentSpent}%
          </span>
        </div>

        {/* Multi-segment Colored Allocation Bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex shadow-inner">
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.map((cat) => {
              const color = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.OTHER;
              return (
                <div
                  key={cat.category}
                  className={`${color.bg} h-full transition-all duration-300 relative group cursor-pointer`}
                  style={{ width: `${Math.max(2, cat.percentageOfBudget)}%` }}
                  title={`${cat.category}: ${formatCurrency(cat.estimated)} (${cat.percentageOfBudget}%)`}
                />
              );
            })
          ) : (
            <div className="bg-slate-300 h-full w-full" />
          )}
        </div>

        {/* Legend Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categoryBreakdown.map((cat) => {
            const color = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.OTHER;
            return (
              <button
                key={cat.category}
                onClick={() => setFilterCategory(filterCategory === cat.category ? 'ALL' : cat.category)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  filterCategory === cat.category
                    ? 'ring-2 ring-brand-500 border-brand-500 bg-slate-50'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${color.bg}`} />
                <span className="text-slate-800">{cat.category}</span>
                <span className="text-slate-400 font-bold">({formatCurrency(cat.estimated)})</span>
              </button>
            );
          })}
          {filterCategory !== 'ALL' && (
            <button
              onClick={() => setFilterCategory('ALL')}
              className="text-xs text-brand-600 hover:underline font-semibold ml-2"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Line Items Table & Add/Edit Management */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Budget Ledger {filterCategory !== 'ALL' && `(${filterCategory})`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click checkboxes to mark items as paid, or click edit to update quotes.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Add Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isEditing = editingItemId === item.id;
              const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER;

              if (isEditing) {
                return (
                  <div key={item.id} className="p-4 bg-slate-50/90 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Actual"
                        value={editActualCost}
                        onChange={(e) => setEditActualCost(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
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
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 ${color.text} uppercase`}>
                          {item.category}
                        </span>
                        {item.isPaid && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Paid
                          </span>
                        )}
                      </div>
                      {item.notes && <p className="text-xs text-slate-500 mt-0.5">{item.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.actualCost > 0 ? item.actualCost : item.estimatedCost)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.actualCost > 0 ? `Est: ${formatCurrency(item.estimatedCost)}` : 'Estimated'}
                      </div>
                    </div>

                    <button
                      onClick={() => startEditing(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No budget items recorded for this filter. Click "Add Item" above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
