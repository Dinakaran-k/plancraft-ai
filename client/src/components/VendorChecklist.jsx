import React, { useState } from 'react';
import { Users, Plus, Trash2, Check, Phone, DollarSign, HelpCircle, Sparkles } from 'lucide-react';

const STATUSES = [
  { id: 'NOT_CONTACTED', label: 'Not Contacted', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'INQUIRED', label: 'Inquired', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'BOOKED', label: 'Booked', color: 'bg-indigoBrand-50 text-indigoBrand-700 border-indigoBrand-200' },
  { id: 'CONFIRMED', label: 'Confirmed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
];

const VENDOR_CATEGORIES = [
  'VENUE',
  'CATERING',
  'PHOTOGRAPHY',
  'MUSIC',
  'FLORIST',
  'RENTALS',
  'OFFICIANT',
  'SECURITY',
  'OTHER'
];

export default function VendorChecklist({
  event,
  summary,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  currency = 'USD'
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('VENUE');
  const [contactInfo, setContactInfo] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [notes, setNotes] = useState('');

  const items = event.vendorItems || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    onAddVendor({
      vendorName: vendorName.trim(),
      category,
      contactInfo: contactInfo.trim() || null,
      quotedPrice: quotedPrice ? Number(quotedPrice) : null,
      notes: notes.trim() || null,
      status: 'NOT_CONTACTED'
    });

    setVendorName('');
    setContactInfo('');
    setQuotedPrice('');
    setNotes('');
    setIsAdding(false);
  };

  const formatPrice = (val) => {
    if (!val) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header Pipeline Summary */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Vendor Management & Screening Pipeline</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track contracts, quotes, and AI-recommended screening questions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Add Vendor Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="vendor-name" className="block text-xs font-semibold text-slate-600 mb-1">Vendor Role / Name *</label>
            <input
              id="vendor-name"
              type="text"
              required
              placeholder="e.g. Starlight Live Band or Main Venue"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-category" className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              id="vendor-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            >
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vendor-contact" className="block text-xs font-semibold text-slate-600 mb-1">Contact / Website</label>
            <input
              id="vendor-contact"
              type="text"
              placeholder="Email, phone or URL"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-quoted-price" className="block text-xs font-semibold text-slate-600 mb-1">Quoted Price</label>
            <input
              id="vendor-quoted-price"
              type="number"
              placeholder="0"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="vendor-notes" className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <input
              id="vendor-notes"
              type="text"
              placeholder="Key notes or requirements"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end space-x-2 pt-2">
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
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{item.vendorName}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteVendor(item.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors"
                    aria-label={`Remove vendor: ${item.vendorName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.contactInfo && (
                  <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.contactInfo}</span>
                  </div>
                )}

                {/* AI Screening Questions Banner */}
                {item.aiScreeningTips && (
                  <div className="mt-3 p-3 bg-indigoBrand-50/60 border border-indigoBrand-100 rounded-xl">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigoBrand-800 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigoBrand-600" />
                      <span>AI Screening Advice & Question</span>
                    </div>
                    <p className="text-xs text-indigoBrand-950/80 leading-relaxed">
                      {item.aiScreeningTips}
                    </p>
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-slate-500 mt-2">{item.notes}</p>
                )}
              </div>

              {/* Status and Pricing Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Quote</span>
                  <span className="text-sm font-bold text-slate-900">{formatPrice(item.quotedPrice)}</span>
                </div>

                {/* Status Dropdown */}
                <select
                  value={item.status}
                  onChange={(e) => onUpdateVendor(item.id, { status: e.target.value })}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-white focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
                >
                  {STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
            No vendors registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
