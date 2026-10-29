import React, { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Circle, Calendar, Flag, Sparkles } from 'lucide-react';

const PHASES = [
  { id: 'ALL', label: 'All Milestones' },
  { id: 'EARLY_PLANNING', label: 'Early Planning' },
  { id: 'MID_PLANNING', label: 'Mid Planning' },
  { id: 'FINAL_PREP', label: 'Final Prep' },
  { id: 'DAY_OF', label: 'Day-Of Run-of-Show' },
  { id: 'POST_EVENT', label: 'Post-Event' }
];

export default function TimelineManager({
  event,
  summary,
  onToggleComplete,
  onAddItem,
  onDeleteItem
}) {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('EARLY_PLANNING');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const items = event.timelineItems || [];
  const filteredItems = selectedPhase === 'ALL'
    ? items
    : items.filter((i) => i.phase === selectedPhase);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const percentComplete = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      phase,
      time: time.trim() || null,
      notes: notes.trim() || null
    });

    setTitle('');
    setTime('');
    setNotes('');
    setIsAdding(false);
  };

  const getPhaseColor = (p) => {
    switch (p) {
      case 'EARLY_PLANNING': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'MID_PLANNING': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'FINAL_PREP': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DAY_OF': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST_EVENT': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Progress Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Milestone Schedule & Run-of-Show</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {items.length} milestones completed ({percentComplete}%)
          </p>
        </div>

        <div className="w-full sm:w-64 bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPhase(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPhase === p.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="ml-auto inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add Form Dropdown */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="timeline-title" className="block text-xs font-semibold text-slate-600 mb-1">Milestone Action *</label>
            <input
              id="timeline-title"
              type="text"
              required
              placeholder="e.g. Finalize Seating Chart & Print Menu Cards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="timeline-phase" className="block text-xs font-semibold text-slate-600 mb-1">Planning Phase</label>
            <select
              id="timeline-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              {PHASES.filter((p) => p.id !== 'ALL').map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeline-time" className="block text-xs font-semibold text-slate-600 mb-1">Timing / Offset</label>
            <input
              id="timeline-time"
              type="text"
              placeholder="e.g. 2 Weeks Out or 14:30"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="timeline-notes" className="block text-xs font-semibold text-slate-600 mb-1">Notes / Instructions</label>
            <input
              id="timeline-notes"
              type="text"
              placeholder="Key deliverable details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end space-x-2 pt-2">
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
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                item.isCompleted ? 'bg-slate-50/50' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors focus:ring-2 focus:ring-brand-500 rounded"
                  aria-label={item.isCompleted ? 'Mark milestone as pending' : 'Mark milestone as complete'}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className={`text-sm font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPhaseColor(item.phase)}`}>
                      {item.phase.replace(/_/g, ' ')}
                    </span>
                    {item.time && (
                      <span className="text-xs text-slate-500 inline-flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.time}</span>
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">{item.notes}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteItem(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                aria-label={`Delete milestone: ${item.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            No milestones found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
