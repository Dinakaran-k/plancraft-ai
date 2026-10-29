import React from 'react';
import { Calendar, Sparkles, Plus, Layers, Heart, Cake, Users } from 'lucide-react';

export default function Header({
  events,
  currentEvent,
  onSelectEvent,
  onOpenWizard,
  onOpenCoPilot
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PlanCraft <span className="text-brand-600">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {events.length > 0 && (
            <div className="relative">
              <label htmlFor="event-select" className="sr-only">Select Active Event</label>
              <select
                id="event-select"
                value={currentEvent?.id || ''}
                onChange={(e) => onSelectEvent(e.target.value)}
                className="text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all max-w-[200px] truncate"
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
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigoBrand-50 text-indigoBrand-700 hover:bg-indigoBrand-100 border border-indigoBrand-200 transition-colors focus:ring-2 focus:ring-indigoBrand-500"
              aria-label="Open AI Planning Assistant"
            >
              <Sparkles className="w-4 h-4 text-indigoBrand-600" />
              <span className="hidden md:inline">Ask AI Co-Pilot</span>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-brand-500"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>
    </header>
  );
}
