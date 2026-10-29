import React, { useState } from 'react';
import { Sparkles, Palette, Utensils, Music, Gift, Plus, Trash2, Tag, Copy, Check, Star } from 'lucide-react';

const CATEGORY_ICONS = {
  THEME_DECOR: Palette,
  FOOD_BEVERAGE: Utensils,
  ENTERTAINMENT: Music,
  GIFT_FAVOR: Gift,
  LOGISTICS: Sparkles
};

const CATEGORY_COLORS = {
  THEME_DECOR: 'from-pink-500/10 to-rose-500/10 text-rose-600 border-rose-200',
  FOOD_BEVERAGE: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200',
  ENTERTAINMENT: 'from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-200',
  GIFT_FAVOR: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200',
  LOGISTICS: 'from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-200'
};

export default function PersonalizedIdeas({
  event,
  onAddIdea,
  onDeleteIdea,
  onGenerateMoreIdeas,
  isSparkingIdeas
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('THEME_DECOR');
  const [costTier, setCostTier] = useState('MEDIUM');
  const [copiedId, setCopiedId] = useState(null);
  const [favorites, setFavorites] = useState({});

  const ideas = event.personalizedIdeas || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddIdea({
      title: title.trim(),
      description: description.trim(),
      category,
      costTier
    });

    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCostBadge = (tier) => {
    switch (tier) {
      case 'LOW':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">Budget Friendly</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs">Moderate</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">Premium Splurge</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Theme & Creative Concept Showcase */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-9 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>GenAI Creative Vision & Concept</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-snug">
            {event.aiThemeConcept || 'Custom Tailored Event Experience'}
          </h2>

          {event.aiOverview && (
            <p className="mt-3.5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
              {event.aiOverview}
            </p>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs">
            {event.vibe && (
              <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Aesthetic Vibe</span>
                <span className="text-white font-semibold text-xs mt-0.5 block">{event.vibe}</span>
              </div>
            )}
            {event.location && (
              <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Setting & Venue</span>
                <span className="text-white font-semibold text-xs mt-0.5 block">{event.location}</span>
              </div>
            )}
            <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Atmosphere Scale</span>
              <span className="text-white font-semibold text-xs mt-0.5 block">{event.guestCount} Guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Curated Experiential Ideas</h3>
          <p className="text-xs text-slate-500 mt-0.5">Bespoke touches generated by Gemini to make this gathering truly unforgettable.</p>
        </div>

        <div className="flex items-center space-x-2">
          {onGenerateMoreIdeas && (
            <button
              onClick={onGenerateMoreIdeas}
              disabled={isSparkingIdeas}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="Ask Gemini to dream up 3 fresh creative touches for this event"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSparkingIdeas ? 'animate-spin' : ''}`} />
              <span>{isSparkingIdeas ? 'Sparking...' : 'Spark 3 More Ideas (Gemini)'}</span>
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-md space-y-3.5 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="idea-title" className="block text-xs font-bold text-slate-700 mb-1">Idea Title *</label>
              <input
                id="idea-title"
                type="text"
                required
                placeholder="e.g. Signature Polaroid Guestbook Station"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="idea-category" className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                id="idea-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="THEME_DECOR">Theme & Decor</option>
                <option value="FOOD_BEVERAGE">Food & Beverage</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="GIFT_FAVOR">Gift & Favors</option>
                <option value="LOGISTICS">Logistics</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="idea-description" className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              id="idea-description"
              rows="2"
              placeholder="Why this makes the event special and how to execute it."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="idea-cost-tier" className="text-xs font-medium text-slate-500">Cost Tier:</label>
              <select
                id="idea-cost-tier"
                value={costTier}
                onChange={(e) => setCostTier(e.target.value)}
                className="text-xs border rounded-lg px-2.5 py-1 bg-white font-semibold text-slate-700"
              >
                <option value="LOW">Low / DIY</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">Premium</option>
              </select>
            </div>

            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-sm"
              >
                Save Idea
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.length > 0 ? (
          ideas.map((idea) => {
            const Icon = CATEGORY_ICONS[idea.category] || Sparkles;
            const categoryStyle = CATEGORY_COLORS[idea.category] || CATEGORY_COLORS.LOGISTICS;
            const isFav = !!favorites[idea.id];
            const isCopied = copiedId === idea.id;

            return (
              <div
                key={idea.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group hover:border-slate-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${categoryStyle} flex items-center justify-center flex-shrink-0 border shadow-2xs`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center space-x-1">
                      {getCostBadge(idea.costTier)}
                      <button
                        onClick={() => toggleFavorite(idea.id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isFav ? 'text-amber-500 fill-amber-400' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={isFav ? 'Favorited' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-3 group-hover:text-brand-700 transition-colors">
                    {idea.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {idea.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {idea.category.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleCopy(idea.id, `${idea.title}: ${idea.description}`)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Copy idea description"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onDeleteIdea(idea.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      aria-label={`Delete idea: ${idea.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-10 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
            No personalized ideas saved yet.
          </div>
        )}
      </div>
    </div>
  );
}
