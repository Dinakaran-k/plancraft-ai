import { useState, useMemo } from 'react';
import {
  Sparkles,
  DollarSign,
  Clock,
  Users,
  Lightbulb,
  Calendar,
  MapPin,
  Trash2,
  Printer,
  Heart,
  Cake
} from 'lucide-react';

import BudgetManager from './BudgetManager';
import TimelineManager from './TimelineManager';
import VendorChecklist from './VendorChecklist';
import PersonalizedIdeas from './PersonalizedIdeas';

const TABS = [
  { id: 'ideas', label: 'Theme & Ideas', icon: Lightbulb },
  { id: 'budget', label: 'Budget & Expenses', icon: DollarSign },
  { id: 'timeline', label: 'Timeline & Schedule', icon: Clock },
  { id: 'vendors', label: 'Vendor Pipeline', icon: Users }
];

export default function EventDashboard({
  event,
  onRefresh: _onRefresh,
  onOpenCoPilot,
  onDeleteEvent,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteItem,
  onAddTimelineItem,
  onUpdateTimelineItem,
  onToggleTimeline,
  onDeleteTimelineItem,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onAddIdea,
  onDeleteIdea,
  onGenerateMoreIdeas,
  isSparkingIdeas
}) {
  const [activeTab, setActiveTab] = useState('ideas');

  const daysRemaining = useMemo(() => {
    if (!event.targetDate) return null;
    const target = new Date(event.targetDate);
    if (isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [event.targetDate]);

  const summary = event.summary || {};
  const milestonesDone = summary.timelineStats?.completed || 0;
  const milestonesTotal = summary.timelineStats?.total || 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: event.currency || 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getAmbianceGradients = () => {
    switch (event.eventType) {
      case 'WEDDING':
        return {
          banner: 'from-slate-900 via-rose-950/80 to-slate-900',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          accent: 'text-rose-400',
          icon: Heart
        };
      case 'BIRTHDAY':
        return {
          banner: 'from-slate-900 via-indigo-950/80 to-slate-900',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          accent: 'text-indigo-400',
          icon: Cake
        };
      default:
        return {
          banner: 'from-slate-900 via-emerald-950/80 to-slate-900',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accent: 'text-emerald-400',
          icon: Users
        };
    }
  };

  const ambiance = getAmbianceGradients();
  const TypeIcon = ambiance.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Event Overview Hero Banner */}
      <div
        className={`relative bg-gradient-to-r ${ambiance.banner} text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 overflow-hidden print:border-none print:shadow-none print:bg-none print:text-black`}
      >
        {/* Ambient radial blur glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
              <span
                className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${ambiance.badge} uppercase tracking-wider`}
              >
                <TypeIcon className="w-3.5 h-3.5" />
                <span>{event.eventType}</span>
              </span>

              {event.targetDate && (
                <span className="text-xs text-slate-300 font-medium flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.targetDate}</span>
                </span>
              )}

              {event.location && (
                <span className="text-xs text-slate-300 font-medium flex items-center space-x-1 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.location}</span>
                </span>
              )}

              {daysRemaining !== null && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center space-x-1.5 border shadow-2xs ${
                    daysRemaining > 0
                      ? 'bg-amber-400/20 text-amber-200 border-amber-300/40'
                      : daysRemaining === 0
                        ? 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40 animate-pulse'
                        : 'bg-slate-400/20 text-slate-300 border-slate-300/30'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {daysRemaining > 1
                      ? `⏳ ${daysRemaining} Days To Go`
                      : daysRemaining === 1
                        ? '⏳ Tomorrow!'
                        : daysRemaining === 0
                          ? '🎉 Today is the Day!'
                          : `✅ ${Math.abs(daysRemaining)} Days Ago`}
                  </span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {event.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
              <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                👥 <strong className="text-white ml-1">{event.guestCount}</strong> Expected Guests
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                💰 <strong className="text-white ml-1">{formatCurrency(event.totalBudget)}</strong>{' '}
                Target Budget
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                ⏱️{' '}
                <strong className="text-white ml-1">
                  {milestonesDone}/{milestonesTotal}
                </strong>{' '}
                Milestones Completed
              </span>
            </div>
          </div>

          {/* Hero Quick Actions */}
          <div className="flex items-center space-x-2.5 self-start md:self-auto print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all active:scale-95 shadow-sm"
              title="Print or Save PDF"
              aria-label="Print event plan or save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Plan</span>
            </button>

            <button
              onClick={onOpenCoPilot}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-indigoBrand-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-600 hover:to-indigo-800 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Consult Co-Pilot</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                  onDeleteEvent(event.id);
                }
              }}
              className="p-2.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 border border-white/10 transition-colors"
              aria-label="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Bar Navigation */}
      <div
        role="tablist"
        aria-label="Event Management Navigation"
        className="flex items-center space-x-2 border-b border-slate-200/90 pb-px overflow-x-auto print:hidden"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center space-x-2.5 px-5 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all rounded-t-xl ${
                isActive
                  ? 'border-brand-600 text-brand-700 bg-brand-50/70 shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <section
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="transition-all animate-fadeIn"
      >
        {activeTab === 'ideas' && (
          <PersonalizedIdeas
            event={event}
            onAddIdea={onAddIdea}
            onDeleteIdea={onDeleteIdea}
            onGenerateMoreIdeas={onGenerateMoreIdeas}
            isSparkingIdeas={isSparkingIdeas}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetManager
            event={event}
            summary={summary}
            currency={event.currency}
            onAddItem={onAddBudgetItem}
            onUpdateItem={onUpdateBudgetItem}
            onDeleteItem={onDeleteItem}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineManager
            event={event}
            summary={summary}
            onToggleComplete={onToggleTimeline}
            onAddItem={onAddTimelineItem}
            onUpdateItem={onUpdateTimelineItem}
            onDeleteItem={onDeleteTimelineItem}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorChecklist
            event={event}
            summary={summary}
            currency={event.currency}
            onAddVendor={onAddVendor}
            onUpdateVendor={onUpdateVendor}
            onDeleteVendor={onDeleteVendor}
          />
        )}
      </section>
    </div>
  );
}
