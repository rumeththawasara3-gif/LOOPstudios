import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  LOGO_PATH,
  DISPLAY_PHONE,
  getWhatsAppUrl,
  PageView,
} from '../types.ts';

interface FooterProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  onOpenQuoteModal: () => void;
  isDark?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQuoteModal, isDark = true }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="relative border-t border-black/10 dark:border-white/10 bg-[#F1F3F5] dark:bg-[#050608] text-slate-600 dark:text-slate-400 text-xs overflow-hidden z-10 transition-colors">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand Statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src={LOGO_PATH}
                  alt="Loop Studios Brandmark"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className={`h-8 w-auto object-contain ${
                    isDark ? 'brightness-125' : 'brightness-0'
                  }`}
                />
              ) : (
                <span className="text-xl font-bold tracking-tighter text-[#0A0A0C] dark:text-white">
                  ∞
                </span>
              )}
              <span className="font-display font-semibold text-base text-[#0A0A0C] dark:text-white tracking-tight">
                LOOP STUDIOS
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-sm font-light">
              Loop Studios — Full-stack visual content and strategic growth agency.
            </p>

            <div className="pt-1">
              <a
                href="https://maps.app.goo.gl/kzwf9SkoCJSia1J37"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 dark:text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-mono tracking-wide transition-all shadow-sm group"
                title="Open Studio Base Location on Google Maps"
              >
                <span>📍 Base: Sri Lanka · Islandwide & Global On-Site Dispatch</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Clean Navigation Links with Hover Underlines */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Index
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors relative group py-0.5"
                >
                  <span>Home / Who We Are</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-black dark:bg-white" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', 'event-visuals')}
                  className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors relative group py-0.5"
                >
                  <span>Event Visual Production</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-black dark:bg-white" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', 'rates')}
                  className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors relative group py-0.5"
                >
                  <span>Short-Form Editing Rates</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-black dark:bg-white" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', 'retainers')}
                  className="text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors relative group py-0.5"
                >
                  <span>Digital Marketing Retainers</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-black dark:bg-white" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portal')}
                  className="text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white transition-colors relative group py-0.5 font-semibold"
                >
                  <span>Client Review & Asset Portal</span>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-[1px] bg-black dark:bg-white" />
                </button>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Hotline */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Direct Inquiries & Bookings
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Direct WhatsApp hotline for commercial shoots, event dates, and short-form video batches.
            </p>

            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to reach out directly.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0A0A0C] dark:text-white hover:opacity-80 font-mono text-sm py-1 border-b border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white transition-colors"
            >
              <span>{DISPLAY_PHONE}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-14 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Loop Studios. Full-stack visual content & strategic growth.
          </div>
          <div>
            Colombo · Kandy · Galle · Worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};
