import { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, User, HelpCircle } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'How can we cut 15% from catering without guests noticing?',
  'What is our emergency rain contingency plan for outdoor areas?',
  'Suggest 3 unique interactive icebreakers for our guest count.',
  'What hidden contract fees should we watch out for with the venue?'
];

export default function AiCoPilotModal({
  event,
  isOpen,
  onClose,
  onConsult,
  isConsulting
}) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isConsulting) return;
    onConsult(query.trim());
    setQuery('');
  };

  const consultations = event.consultations || [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="copilot-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigoBrand-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigoBrand-500/20 border border-indigoBrand-400/30 flex items-center justify-center text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="copilot-title" className="text-base font-bold">
                AI Planning Co-Pilot
              </h2>
              <p className="text-xs text-indigoBrand-200">
                Contextual consultation for {event.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close AI Co-Pilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quick Inquiries</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(p)}
                className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-indigoBrand-300 hover:text-indigoBrand-700 transition-all text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {consultations.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Bot className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
              <p>Ask anything about budget cuts, venue negotiations, weather contingencies, or creative ideas!</p>
            </div>
          ) : (
            consultations.map((item) => (
              <div key={item.id} className="space-y-2">
                {/* User Message */}
                <div className="flex items-start justify-end space-x-2">
                  <div className="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%] shadow-sm">
                    {item.query}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* AI Reply */}
                <div className="flex items-start space-x-2">
                  <div className="w-7 h-7 rounded-full bg-indigoBrand-100 text-indigoBrand-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[85%] leading-relaxed">
                    {item.reply}
                  </div>
                </div>
              </div>
            ))
          )}

          {isConsulting && (
            <div className="flex items-center space-x-2 text-indigoBrand-600 text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini is analyzing your event data...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Co-Pilot for advice, tradeoff analysis, or tips..."
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigoBrand-500 focus:border-indigoBrand-500 transition-all"
          />
          <button
            type="submit"
            disabled={isConsulting || !query.trim()}
            className="px-4 py-2.5 bg-indigoBrand-600 hover:bg-indigoBrand-700 text-white rounded-xl text-sm font-semibold shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
