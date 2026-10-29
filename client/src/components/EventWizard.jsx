import React, { useState } from 'react';
import { Sparkles, Heart, Cake, Users, Calendar, DollarSign, MapPin, Compass, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const EVENT_PRESETS = [
  {
    type: 'WEDDING',
    label: 'Wedding',
    icon: Heart,
    color: 'text-rose-500 bg-rose-50 border-rose-200 hover:border-rose-300',
    activeColor: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/70',
    defaultBudget: 25000,
    defaultGuests: 120,
    defaultVibe: 'Romantic, elegant floral garden atmosphere'
  },
  {
    type: 'BIRTHDAY',
    label: 'Birthday Party',
    icon: Cake,
    color: 'text-amber-500 bg-amber-50 border-amber-200 hover:border-amber-300',
    activeColor: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/70',
    defaultBudget: 2500,
    defaultGuests: 40,
    defaultVibe: 'Vibrant, festive celebration with interactive music and games'
  },
  {
    type: 'COMMUNITY',
    label: 'Community Event',
    icon: Users,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200 hover:border-emerald-300',
    activeColor: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/70',
    defaultBudget: 7500,
    defaultGuests: 200,
    defaultVibe: 'Welcoming, family-friendly, inclusive gathering with local food'
  }
];

export default function EventWizard({ onGeneratePlan, onCancel, isGenerating }) {
  const [eventType, setEventType] = useState('WEDDING');
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState(120);
  const [totalBudget, setTotalBudget] = useState(25000);
  const [currency, setCurrency] = useState('USD');
  const [targetDate, setTargetDate] = useState('');
  const [location, setLocation] = useState('');
  const [vibe, setVibe] = useState('Romantic, elegant floral garden atmosphere');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const handleSelectPreset = (preset) => {
    setEventType(preset.type);
    setGuestCount(preset.defaultGuests);
    setTotalBudget(preset.defaultBudget);
    setVibe(preset.defaultVibe);
    if (!name || name === 'My Event') {
      setName(preset.type === 'WEDDING' ? 'Dream Wedding Celebration' : preset.type === 'BIRTHDAY' ? 'Milestone Birthday Party' : 'Annual Neighborhood Festival');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide an event name.');
      return;
    }

    if (guestCount <= 0) {
      setError('Guest count must be at least 1.');
      return;
    }

    if (totalBudget < 0) {
      setError('Total budget cannot be negative.');
      return;
    }

    onGeneratePlan({
      name: name.trim(),
      eventType,
      guestCount: Number(guestCount),
      totalBudget: Number(totalBudget),
      currency,
      targetDate: targetDate || null,
      location: location.trim() || null,
      vibe: vibe.trim() || null,
      notes: notes.trim() || null
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-brand-400 text-sm font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>GenAI Event Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Design Your Next Memorable Gathering
          </h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl">
            Select your event type and parameters. Google Gemini will engineer a complete blueprint with custom budgets, timelines, vendor checklists, and creative ideas.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              1. Choose Event Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EVENT_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = eventType === preset.type;
                return (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected ? preset.activeColor : preset.color
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{preset.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Preset: ~{preset.defaultGuests} guests</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Event Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena & Lucas Garden Wedding"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Date (Optional)
              </label>
              <div className="relative">
                <input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Guests & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="guestCount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Guests *
              </label>
              <input
                id="guestCount"
                type="number"
                min="1"
                max="100000"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="totalBudget" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Budget *
              </label>
              <input
                id="totalBudget"
                type="number"
                min="0"
                step="50"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          {/* Step 4: Setting, Theme & Vibe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Venue Setting
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Botanical Gardens, Outdoor Pavilion, Loft"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="vibe" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Theme / Desired Vibe
              </label>
              <input
                id="vibe"
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Rustic chic, 90s retro, modern minimalist"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Step 5: Notes & Dietary */}
          <div>
            <label htmlFor="notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Requirements, Dietary or Entertainment Preferences
            </label>
            <textarea
              id="notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need gluten-free catering options, acoustic live music preferred, family-friendly kids area."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Back to Dashboard
              </button>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto ml-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 shadow-md shadow-brand-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-brand-500"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gemini is Crafting Your Blueprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Event Blueprint</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
