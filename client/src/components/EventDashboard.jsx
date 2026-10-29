import React, { useState } from 'react';
import {
  Sparkles,
  DollarSign,
  Clock,
  Users,
  Lightbulb,
  Calendar,
  MapPin,
  Trash2,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Printer
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
  onRefresh,
  onOpenCoPilot,
  onDeleteEvent,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  onAddTimelineItem,
  onUpdateTimelineItem,
  onToggleTimeline,
  onDeleteTimelineItem,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onAddIdea,
  onDeleteIdea
}) {
  const [activeTab, setActiveTab] = useState('ideas');

  const summary = event.summary || {};
  const budgetUtilization = summary.percentSpent || 0;
  const milestonesDone = summary.timelineStats?.completed || 0;
  const milestonesTotal = summary.timelineStats?.total || 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: event.currency || 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Event Overview Hero Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:shadow-none">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wide">
              {event.eventType}
            </span>
            {event.targetDate && (
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.targetDate}</span>
              </span>
            )}
            {event.location && (
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.location}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {event.name}
          </h1>

          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
            <span><strong>{event.guestCount}</strong> Expected Guests</span>
            <span>•</span>
            <span><strong>{formatCurrency(event.totalBudget)}</strong> Target Budget</span>
          </div>
        </div>

        {/* Hero Quick Actions */}
        <div className="flex items-center space-x-3 self-start md:self-auto print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Plan</span>
          </button>

          <button
            onClick={onOpenCoPilot}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigoBrand-600 to-indigoBrand-700 text-white shadow-md shadow-indigoBrand-500/20 hover:from-indigoBrand-700 hover:to-indigoBrand-800 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Co-Pilot</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                onDeleteEvent(event.id);
              }
            }}
            className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-slate-200 transition-colors"
            aria-label="Delete Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Bar Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-px overflow-x-auto print:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center space-x-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-brand-600 text-brand-700 bg-brand-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <main>
        {activeTab === 'ideas' && (
          <PersonalizedIdeas
            event={event}
            onAddIdea={onAddIdea}
            onDeleteIdea={onDeleteIdea}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetManager
            event={event}
            summary={summary}
            currency={event.currency}
            onAddItem={onAddBudgetItem}
            onUpdateItem={onUpdateBudgetItem}
            onDeleteItem={onDeleteBudgetItem}
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
      </main>
    </div>
  );
}
