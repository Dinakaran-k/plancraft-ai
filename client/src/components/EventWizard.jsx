import React, { useState } from 'react';
import { Sparkles, Heart, Cake, Users, Calendar, DollarSign, MapPin, Compass, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const EVENT_PRESETS = [
  {
    type: 'WEDDING',
    label: 'Wedding',
    subtitle: 'Ceremony & Reception Orchestration',
    icon: Heart,
    color: 'border-rose-200/80 hover:border-rose-300 bg-gradient-to-b from-rose-50/50 to-white text-rose-600',
    activeColor: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10',
    defaultBudget: 25000,
    defaultGuests: 120,
    defaultVibe: 'Romantic, elegant floral garden atmosphere with ambient fairy lighting'
  },
  {
    type: 'BIRTHDAY',
    label: 'Birthday Party',
    subtitle: 'Milestone & Themed Celebrations',
    icon: Cake,
    color: 'border-amber-200/80 hover:border-amber-300 bg-gradient-to-b from-amber-50/50 to-white text-amber-600',
    activeColor: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/80 shadow-md shadow-amber-500/10',
    defaultBudget: 2500,
    defaultGuests: 40,
    defaultVibe: 'Vibrant, festive celebration with interactive music, signature mocktails, and games'
  },
  {
    type: 'COMMUNITY',
    label: 'Community Event',
    subtitle: 'Festivals, Galas & Fundraisers',
    icon: Users,
    color: 'border-emerald-200/80 hover:border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white text-emerald-600',
    activeColor: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-500/10',
    defaultBudget: 7500,
    defaultGuests: 200,
    defaultVibe: 'Welcoming, family-friendly, inclusive gathering with local food trucks and live entertainment'
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
  const [vibe, setVibe] = useState('Romantic, elegant floral garden atmosphere with ambient fairy lighting');
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
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigoBrand-950 text-white p-7 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold tracking-wider uppercase mb-2.5">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Google Gemini Event Blueprint Architect</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Design Your Next Memorable Gathering
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              Select your event parameters. Gemini will formulate a comprehensive, synchronized master plan with dynamic budgets, milestone schedules, vendor checklists, and creative ideas.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-9 space-y-7">
          {/* Step 1: Select Type */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                1. Select Gathering Type
              </label>
              <span className="text-xs text-slate-400 font-medium">Click to populate tailored defaults</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {EVENT_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = eventType === preset.type;
                return (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer relative group ${
                      isSelected ? preset.activeColor : preset.color
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 absolute top-3.5 right-3.5" />
                    )}
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base">{preset.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{preset.subtitle}</div>
                      <div className="text-[11px] font-semibold text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded-md mt-2 inline-block">
                        ~{preset.defaultGuests} guests • ${preset.defaultBudget.toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Event Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Event Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena & Lucas Garden Wedding"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="targetDate" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Target Date (Optional)
              </label>
              <input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Step 3: Guests & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="guestCount" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="totalBudget" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium cursor-pointer"
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
              <label htmlFor="location" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Venue Setting
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Botanical Gardens, Outdoor Pavilion, Loft"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="vibe" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Theme / Desired Vibe
              </label>
              <input
                id="vibe"
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Rustic chic, 90s retro, modern minimalist"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Step 5: Notes & Dietary */}
          <div>
            <label htmlFor="notes" className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Requirements, Dietary or Entertainment Preferences
            </label>
            <textarea
              id="notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need gluten-free catering options, acoustic live music preferred, family-friendly kids area."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Back to Dashboard
              </button>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto ml-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 hover:from-brand-700 hover:to-emerald-700 shadow-lg shadow-brand-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-brand-500 active:scale-95 cursor-pointer"
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
