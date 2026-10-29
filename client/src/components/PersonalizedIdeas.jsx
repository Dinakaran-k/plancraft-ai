import React, { useState } from 'react';
import { Sparkles, Palette, Utensils, Music, Gift, Plus, Trash2, Tag } from 'lucide-react';

const CATEGORY_ICONS = {
  THEME_DECOR: Palette,
  FOOD_BEVERAGE: Utensils,
  ENTERTAINMENT: Music,
  GIFT_FAVOR: Gift,
  LOGISTICS: Sparkles
};

export default function PersonalizedIdeas({
  event,
  onAddIdea,
  onDeleteIdea
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('THEME_DECOR');
  const [costTier, setCostTier] = useState('MEDIUM');

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

  const getCostBadge = (tier) => {
    switch (tier) {
      case 'LOW':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Budget Friendly</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">Moderate</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Premium Splurge</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Theme & Creative Concept Showcase */}
      <div className="bg-gradient-to-br from-indigoBrand-950 via-slate-900 to-indigoBrand-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>GenAI Creative Vision & Concept</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {event.aiThemeConcept || 'Custom Tailored Event Experience'}
          </h2>

          {event.aiOverview && (
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
              {event.aiOverview}
            </p>
          )}

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {event.vibe && (
              <div>
                <span className="text-slate-500 block">Vibe:</span>
                <span className="text-slate-200 font-medium">{event.vibe}</span>
              </div>
            )}
            {event.location && (
              <div>
                <span className="text-slate-500 block">Setting:</span>
                <span className="text-slate-200 font-medium">{event.location}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500 block">Scale:</span>
              <span className="text-slate-200 font-medium">{event.guestCount} Attendees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Personalized Experiences & Ideas</h3>
          <p className="text-xs text-slate-500 mt-0.5">Custom concepts curated specifically for your guest count and theme.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Idea</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="idea-title" className="block text-xs font-semibold text-slate-600 mb-1">Idea Title *</label>
              <input
                id="idea-title"
                type="text"
                required
                placeholder="e.g. Signature Polaroid Guestbook Station"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="idea-category" className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                id="idea-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
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
            <label htmlFor="idea-description" className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              id="idea-description"
              rows="2"
              placeholder="Why this makes the event special and how to execute it."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="idea-cost-tier" className="text-xs text-slate-500">Cost Tier:</label>
              <select
                id="idea-cost-tier"
                value={costTier}
                onChange={(e) => setCostTier(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
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
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
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
            return (
              <div
                key={idea.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    {getCostBadge(idea.costTier)}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-3">{idea.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {idea.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{idea.category.replace(/_/g, ' ')}</span>
                  <button
                    onClick={() => onDeleteIdea(idea.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors"
                    aria-label={`Delete idea: ${idea.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-8 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No personalized ideas saved yet.
          </div>
        )}
      </div>
    </div>
  );
}
