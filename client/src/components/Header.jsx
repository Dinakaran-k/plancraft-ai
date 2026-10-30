import { Sparkles, Plus, Database } from 'lucide-react';

export default function Header({
  events,
  currentEvent,
  onSelectEvent,
  onOpenWizard,
  onOpenCoPilot
}) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25 ring-2 ring-white">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                PlanCraft{' '}
                <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Gemini 2.5 Flash</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center space-x-1.5">
              <span>Event Orchestration Co-Pilot</span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold inline-flex items-center space-x-0.5">
                <Database className="w-2.5 h-2.5 inline mr-0.5" />
                Neon Postgres
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5">
          {events.length > 0 && (
            <div className="relative">
              <label htmlFor="event-select" className="sr-only">
                Select Active Event
              </label>
              <select
                id="event-select"
                value={currentEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs transition-all max-w-[190px] sm:max-w-[240px] truncate cursor-pointer hover:bg-slate-100/80"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.eventType})
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentEvent && (
            <button
              onClick={onOpenCoPilot}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-50 to-indigo-100/80 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200/80 border border-indigo-200/80 shadow-2xs transition-all focus:ring-2 focus:ring-indigo-500 active:scale-95"
              aria-label="Open AI Planning Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Ask AI Co-Pilot</span>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-emerald-600 text-white hover:from-brand-700 hover:to-emerald-700 shadow-sm shadow-brand-600/20 hover:shadow transition-all focus:ring-2 focus:ring-brand-500 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    </header>
  );
}
