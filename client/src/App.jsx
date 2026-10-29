import React, { useState, useEffect } from 'react';
import { useSession } from './hooks/useSession';
import { eventService } from './services/api';

import Header from './components/Header';
import EventWizard from './components/EventWizard';
import EventDashboard from './components/EventDashboard';
import AiCoPilotModal from './components/AiCoPilotModal';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import { Loader2, Sparkles, Plus, AlertCircle } from 'lucide-react';

export default function App() {
  const sessionId = useSession();
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [errorBanner, setErrorBanner] = useState(null);

  // Load user events once session is active
  useEffect(() => {
    if (!sessionId) return;
    loadEvents();
  }, [sessionId]);

  const loadEvents = async (autoSelectId = null) => {
    try {
      setIsLoading(true);
      const res = await eventService.list();
      const list = res.events || [];
      setEvents(list);

      if (list.length > 0) {
        const target = autoSelectId
          ? list.find((e) => e.id === autoSelectId) || list[0]
          : currentEvent
          ? list.find((e) => e.id === currentEvent.id) || list[0]
          : list[0];
        await selectEvent(target.id);
        setShowWizard(false);
      } else {
        setCurrentEvent(null);
        setShowWizard(true);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setErrorBanner('Failed to load events. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectEvent = async (id) => {
    try {
      const res = await eventService.get(id);
      setCurrentEvent(res.event);
      setAnnouncement(`Loaded event ${res.event.name}`);
    } catch (err) {
      console.error('Failed to get event:', err);
    }
  };

  // Generate Event Blueprint via Gemini
  const handleGeneratePlan = async (formData) => {
    try {
      setIsGenerating(true);
      setErrorBanner(null);
      setAnnouncement('Gemini is crafting your complete event blueprint...');

      const res = await eventService.generatePlan(formData);
      const newEvent = res.event;

      setEvents((prev) => [newEvent, ...prev]);
      setCurrentEvent(newEvent);
      setShowWizard(false);
      setAnnouncement(`Event "${newEvent.name}" generated successfully with budget, timeline, and vendors.`);
    } catch (err) {
      console.error('Generation failed:', err);
      setErrorBanner(err.response?.data?.error || 'Failed to generate event plan. Please check inputs and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Co-Pilot Consultation
  const handleConsultAi = async (query) => {
    if (!currentEvent) return;
    try {
      setIsConsulting(true);
      setAnnouncement('Consulting AI Co-Pilot...');
      const res = await eventService.consultAi(currentEvent.id, query);
      setCurrentEvent((prev) => ({
        ...prev,
        consultations: [res.consultation, ...(prev.consultations || [])]
      }));
      setAnnouncement('AI Co-Pilot response received.');
    } catch (err) {
      console.error('Consultation failed:', err);
      alert('AI Consultation temporarily unavailable. Please try again.');
    } finally {
      setIsConsulting(false);
    }
  };

  // Budget Handlers
  const handleAddBudgetItem = async (data) => {
    if (!currentEvent) return;
    const res = await eventService.addBudgetItem(currentEvent.id, data);
    await selectEvent(currentEvent.id);
  };

  const handleUpdateBudgetItem = async (itemId, data) => {
    if (!currentEvent) return;
    await eventService.updateBudgetItem(itemId, data);
    await selectEvent(currentEvent.id);
  };

  const handleDeleteBudgetItem = async (itemId) => {
    if (!currentEvent) return;
    await eventService.deleteBudgetItem(itemId);
    await selectEvent(currentEvent.id);
  };

  // Timeline Handlers
  const handleAddTimelineItem = async (data) => {
    if (!currentEvent) return;
    await eventService.addTimelineItem(currentEvent.id, data);
    await selectEvent(currentEvent.id);
  };

  const handleToggleTimeline = async (itemId) => {
    if (!currentEvent) return;
    await eventService.toggleTimeline(itemId);
    await selectEvent(currentEvent.id);
  };

  const handleDeleteTimelineItem = async (itemId) => {
    if (!currentEvent) return;
    await eventService.deleteTimelineItem(itemId);
    await selectEvent(currentEvent.id);
  };

  // Vendor Handlers
  const handleAddVendor = async (data) => {
    if (!currentEvent) return;
    await eventService.addVendorItem(currentEvent.id, data);
    await selectEvent(currentEvent.id);
  };

  const handleUpdateVendor = async (itemId, data) => {
    if (!currentEvent) return;
    await eventService.updateVendorItem(itemId, data);
    await selectEvent(currentEvent.id);
  };

  const handleDeleteVendor = async (itemId) => {
    if (!currentEvent) return;
    await eventService.deleteVendorItem(itemId);
    await selectEvent(currentEvent.id);
  };

  // Idea Handlers
  const handleAddIdea = async (data) => {
    if (!currentEvent) return;
    await eventService.addIdea(currentEvent.id, data);
    await selectEvent(currentEvent.id);
  };

  const handleDeleteIdea = async (itemId) => {
    if (!currentEvent) return;
    await eventService.deleteIdea(itemId);
    await selectEvent(currentEvent.id);
  };

  // Event Deletion
  const handleDeleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      await loadEvents();
    } catch (err) {
      console.error('Delete event failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AccessibilityAnnouncer message={announcement} />

      <Header
        events={events}
        currentEvent={currentEvent}
        onSelectEvent={selectEvent}
        onOpenWizard={() => setShowWizard(true)}
        onOpenCoPilot={() => setIsCoPilotOpen(true)}
      />

      {errorBanner && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-rose-600 hover:text-rose-800 font-semibold text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <span className="text-sm font-medium text-slate-500">Initializing PlanCraft AI...</span>
          </div>
        ) : showWizard ? (
          <EventWizard
            onGeneratePlan={handleGeneratePlan}
            onCancel={events.length > 0 ? () => setShowWizard(false) : null}
            isGenerating={isGenerating}
          />
        ) : currentEvent ? (
          <EventDashboard
            event={currentEvent}
            onRefresh={() => selectEvent(currentEvent.id)}
            onOpenCoPilot={() => setIsCoPilotOpen(true)}
            onDeleteEvent={handleDeleteEvent}
            onAddBudgetItem={handleAddBudgetItem}
            onUpdateBudgetItem={handleUpdateBudgetItem}
            onDeleteBudgetItem={handleDeleteBudgetItem}
            onAddTimelineItem={handleAddTimelineItem}
            onToggleTimeline={handleToggleTimeline}
            onDeleteTimelineItem={handleDeleteTimelineItem}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onDeleteVendor={handleDeleteVendor}
            onAddIdea={handleAddIdea}
            onDeleteIdea={handleDeleteIdea}
          />
        ) : (
          <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <Sparkles className="w-12 h-12 text-brand-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">No Events Planned Yet</h2>
            <p className="text-sm text-slate-500">
              Start by creating your first wedding, birthday, or community event with Google Gemini AI.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Event</span>
            </button>
          </div>
        )}
      </div>

      {currentEvent && (
        <AiCoPilotModal
          event={currentEvent}
          isOpen={isCoPilotOpen}
          onClose={() => setIsCoPilotOpen(false)}
          onConsult={handleConsultAi}
          isConsulting={isConsulting}
        />
      )}
    </div>
  );
}
