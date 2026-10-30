import { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Circle, Edit2, X, Check, Milestone, Download } from 'lucide-react';

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
  summary: _summary,
  onToggleComplete,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // Add form states
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState('EARLY_PLANNING');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');

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

  const startEdit = (item) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditTime(item.time || '');
    setEditNotes(item.notes || '');
  };

  const saveEdit = (id) => {
    if (onUpdateItem) {
      onUpdateItem(id, {
        title: editTitle.trim(),
        time: editTime.trim() || null,
        notes: editNotes.trim() || null
      });
    }
    setEditingItemId(null);
  };

  const handleExportICS = () => {
    if (items.length === 0) {
      alert('No timeline milestones to export.');
      return;
    }

    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

    let baseDate = event.targetDate ? new Date(event.targetDate) : new Date();
    if (isNaN(baseDate.getTime())) baseDate = new Date();

    const eventsICS = items.map((item, idx) => {
      const eventStart = new Date(baseDate.getTime() + idx * 3600 * 1000);
      const dtstart = `${eventStart.getUTCFullYear()}${pad(eventStart.getUTCMonth() + 1)}${pad(eventStart.getUTCDate())}T${pad(eventStart.getUTCHours())}${pad(eventStart.getUTCMinutes())}00Z`;
      const dtend = `${eventStart.getUTCFullYear()}${pad(eventStart.getUTCMonth() + 1)}${pad(eventStart.getUTCDate())}T${pad(eventStart.getUTCHours() + 1)}${pad(eventStart.getUTCMinutes())}00Z`;

      const cleanSummary = (item.title || 'Milestone').replace(/\n/g, ' ');
      const cleanDesc = `Phase: ${item.phase || 'N/A'}\\nTiming: ${item.time || 'N/A'}\\nNotes: ${item.notes || 'None'}`;

      return [
        'BEGIN:VEVENT',
        `UID:plancraft-${event.id}-${item.id || idx}@plancraft.ai`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:[PlanCraft] ${cleanSummary}`,
        `DESCRIPTION:${cleanDesc}`,
        `STATUS:${item.isCompleted ? 'COMPLETED' : 'CONFIRMED'}`,
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PlanCraft AI//Event Milestones//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      eventsICS,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(event.name || 'event').replace(/[^a-z0-9_-]/gi, '_')}_schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPhaseColor = (p) => {
    switch (p) {
      case 'EARLY_PLANNING': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'MID_PLANNING': return 'bg-indigoBrand-50 text-indigoBrand-700 border-indigoBrand-200';
      case 'FINAL_PREP': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DAY_OF': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'POST_EVENT': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Compute tasks per phase for visual phase indicators
  const phaseStats = PHASES.filter((p) => p.id !== 'ALL').map((p) => {
    const total = items.filter((i) => i.phase === p.id).length;
    const done = items.filter((i) => i.phase === p.id && i.isCompleted).length;
    return { ...p, total, done };
  });

  return (
    <div className="space-y-6">
      {/* Timeline Progress Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Milestone className="w-4 h-4 text-brand-600" />
            <span>Milestone Schedule & Run-of-Show</span>
          </h2>
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

      {/* Visual Phase Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {phaseStats.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedPhase(selectedPhase === st.id ? 'ALL' : st.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedPhase === st.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedPhase === st.id ? 'text-brand-400' : 'text-slate-500'}`}>
              {st.label}
            </div>
            <div className="text-base font-bold mt-1">
              {st.done}/{st.total} <span className="text-xs font-normal opacity-70">done</span>
            </div>
          </button>
        ))}
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

        <div className="ml-auto flex items-center space-x-2">
          <button
            onClick={handleExportICS}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 whitespace-nowrap shadow-2xs transition-all active:scale-95"
            title="Export schedule to Apple/Google/Outlook Calendar (.ics)"
            aria-label="Export schedule to calendar file in iCalendar format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Calendar (.ics)</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 whitespace-nowrap shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Add Form Dropdown */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
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
          filteredItems.map((item) => {
            const isEditing = editingItemId === item.id;

            if (isEditing) {
              return (
                <div key={item.id} className="p-4 bg-slate-50/90 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Time / Offset"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-36 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                      title="Save"
                      aria-label="Save milestone changes"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingItemId(null)}
                      className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                      title="Cancel"
                      aria-label="Cancel editing milestone"
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label={`Delete milestone: ${item.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            No milestones found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
