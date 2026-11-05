import React, { useState } from 'react';
import { X, Check, Copy, CheckCheck, ArrowUpRight, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER, GOOGLE_MAPS_LOCATION_URL } from '../types.ts';

interface EventQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

const SERVICE_OPTIONS = [
  { id: 'full-crew', label: 'Full-Crew Event Coverage (Videographers + Photographers + Drones)' },
  { id: 'cinematic-film', label: 'Cinematic Videography & Recap Films' },
  { id: 'signature-photo', label: 'Signature Event Photography & Retouching' },
  { id: '360-vr', label: '360° Memory Capture (Recorded Video & Playback Anywhere)' },
];

export const EventQuoteModal: React.FC<EventQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    return preselectedService ? [preselectedService] : ['full-crew'];
  });
  const [eventType, setEventType] = useState('Corporate Summit / Gala');
  const [location, setLocation] = useState('Colombo, Sri Lanka');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getFormattedMessage = () => {
    const serviceLabels = selectedServices
      .map((id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join('\n• ');

    return `*Loop Studios — Custom Event Quote Inquiry*

*Event Type:* ${eventType}
*Location / Venue:* ${location || 'To be determined'}
*Target Date:* ${date || 'Flexible'}

*Requested Visual Modules:*
• ${serviceLabels || 'Full-Crew Event Coverage'}

${notes ? `*Special Requirements:* ${notes}\n` : ''}
Looking forward to discussing event availability and production details.`;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(getFormattedMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto bg-black/75 dark:bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#090A0E] text-[#0A0A0C] dark:text-white border border-black/10 dark:border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between pb-5 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
              Bespoke Event Media
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
              Request Custom Event Quote
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-light">
              Direct inquiry workflow with immediate WhatsApp dispatch.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-medium">
              Select Production Modules
            </label>
            <div className="space-y-2">
              {SERVICE_OPTIONS.map((opt) => {
                const checked = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleService(opt.id)}
                    className={`w-full flex items-center justify-between text-left p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                      checked
                        ? 'bg-black/5 dark:bg-white/10 border-black/30 dark:border-white/40 text-[#0A0A0C] dark:text-white font-medium'
                        : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-3 border transition-colors ${
                        checked
                          ? 'bg-[#0A0A0C] text-white dark:bg-white dark:text-black border-transparent'
                          : 'border-black/20 dark:border-white/20'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/15 dark:border-white/15 text-xs text-[#0A0A0C] dark:text-white focus:outline-none"
              >
                <option value="Corporate Summit / Gala" className="bg-white dark:bg-[#090A0E]">Corporate Summit / Gala</option>
                <option value="Luxury Wedding & Reception" className="bg-white dark:bg-[#090A0E]">Luxury Wedding & Reception</option>
                <option value="Concert / Music Festival" className="bg-white dark:bg-[#090A0E]">Concert / Music Festival</option>
                <option value="Brand Launch Showcase" className="bg-white dark:bg-[#090A0E]">Brand Launch Showcase</option>
                <option value="Educational / Masterclass" className="bg-white dark:bg-[#090A0E]">Educational / Masterclass</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                Target Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. November 2026"
                className="w-full px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/15 dark:border-white/15 text-xs text-[#0A0A0C] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
              Venue Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Colombo, Galle, or International"
              className="w-full px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/15 dark:border-white/15 text-xs text-[#0A0A0C] dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
              Special Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Need same-day social media reel cutdown..."
              className="w-full px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/15 dark:border-white/15 text-xs text-[#0A0A0C] dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={GOOGLE_MAPS_LOCATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-full bg-blue-500/10 hover:bg-blue-500/15 transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Find Our Studio / Base Location</span>
            <ArrowUpRight className="w-3 h-3 opacity-70" />
          </a>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              <span>Inquire on WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
