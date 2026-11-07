import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  LOGO_PATH,
  DISPLAY_PHONE,
  getWhatsAppUrl,
  PageView,
  SOCIAL_LINKS,
} from '../types.ts';
import { TikTokIcon, InstagramIcon, FacebookIcon } from './SocialIcons.tsx';

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
              <svg 
                className="h-8 w-8 text-[#0A0A0C] dark:text-white" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Geometric Double-Outline Stem */}
                <path 
                  d="M26 15 H40 V85 H26 Z" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
                {/* Upper & Lower Diagonal Arms */}
                <path 
                  d="M40 54 L68 18 H86 L52 58 L88 85 H70 L40 62" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
              </svg>
              <span className="font-display font-semibold text-base text-[#0A0A0C] dark:text-white tracking-tight">
                KULT STUDIOS
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-sm font-light">
              KULT Studios — Full-stack visual content and strategic growth agency.
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

          {/* Connect / Official Social Channels */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Connect / Social
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Follow our latest client productions, vertical reels, and on-location BTS footage across our official channels.
            </p>

            {/* Frosted Glass Social Dock */}
            <div className="space-y-2.5 pt-1">
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.04] transition-all"
              >
                <span className="p-2.5 rounded-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 text-slate-800 dark:text-slate-200 group-hover:text-cyan-400 transition-all shrink-0">
                  <TikTokIcon className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                  <span>TikTok — {SOCIAL_LINKS.tiktokHandle}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-400" />
                </span>
              </a>

              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.04] transition-all"
              >
                <span className="p-2.5 rounded-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 group-hover:border-pink-500/50 group-hover:bg-pink-500/10 text-slate-800 dark:text-slate-200 group-hover:text-pink-400 transition-all shrink-0">
                  <InstagramIcon className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Instagram — {SOCIAL_LINKS.instagramHandle}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-pink-400" />
                </span>
              </a>

              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.04] transition-all"
              >
                <span className="p-2.5 rounded-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 text-slate-800 dark:text-slate-200 group-hover:text-blue-400 transition-all shrink-0">
                  <FacebookIcon className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Facebook — {SOCIAL_LINKS.facebookHandle}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-400" />
                </span>
              </a>
            </div>

            {/* Direct WhatsApp Hotline */}
            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Direct WhatsApp Hotline
              </div>
              <a
                href={getWhatsAppUrl(`Hello KULT Studios, I would like to book a production consultation...`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0A0A0C] dark:text-white hover:text-cyan-400 dark:hover:text-cyan-300 font-mono text-sm py-1 border-b border-black/20 dark:border-white/20 hover:border-cyan-400 dark:hover:border-cyan-300 transition-colors"
              >
                <span>{DISPLAY_PHONE}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-14 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} KULT Studios. All rights reserved. Full-stack visual content & strategic growth.
          </div>
          <div>
            Colombo · Kandy · Galle · Worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};
