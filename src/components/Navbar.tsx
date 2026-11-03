import React, { useState } from 'react';
import { ArrowUpRight, Sun, Moon, Menu, X } from 'lucide-react';
import { LOGO_PATH, getWhatsAppUrl, PageView } from '../types.ts';
import { Magnetic } from './Magnetic.tsx';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, sectionId?: string) => void;
  onOpenQuoteModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenQuoteModal,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleNavClick = (page: PageView, sectionId?: string) => {
    onNavigate(page, sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all">
      <div className="max-w-5xl mx-auto rounded-full editorial-glass shadow-2xl px-5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-8">
        {/* Left: Brand Logo slot with crisp text fallback */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus-visible:outline-none"
          >
            {!logoError ? (
              <img
                src={LOGO_PATH}
                alt="Loop Studios Logo"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className={`h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                  isDark ? 'brightness-125' : 'brightness-0'
                }`}
              />
            ) : (
              <span className="text-xl font-bold tracking-tighter text-[#0A0A0C] dark:text-white">
                ∞
              </span>
            )}
            <span className="font-display font-semibold text-sm sm:text-base tracking-tight text-[#0A0A0C] dark:text-white group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors whitespace-nowrap">
              LOOP <span className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm tracking-normal">STUDIOS</span>
            </span>
          </button>
        </div>

        {/* Center: Minimal Nav Links (Home / Who We Are, Services & Rates) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide uppercase">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              currentPage === 'home'
                ? 'text-[#0A0A0C] dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0A0A0C] dark:hover:text-white'
            }`}
          >
            Home / Who We Are
            {currentPage === 'home' && (
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#0A0A0C] dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('services', 'event-visuals')}
            className={`transition-colors whitespace-nowrap relative py-1 ${
              currentPage === 'services'
                ? 'text-[#0A0A0C] dark:text-white font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#0A0A0C] dark:hover:text-white'
            }`}
          >
            Services & Rates
            {currentPage === 'services' && (
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#0A0A0C] dark:bg-white" />
            )}
          </button>
        </nav>

        {/* Right: Day/Night Toggle + Direct DM Pill Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Day / Night Mode Toggle Icon */}
          <Magnetic strength={0.2}>
            <button
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#0A0A0C] dark:text-white transition-all active:scale-90"
              title={isDark ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-200 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
              )}
            </button>
          </Magnetic>

          {/* Floating Pill Button "WhatsApp DM" */}
          <Magnetic strength={0.2}>
            <a
              href={getWhatsAppUrl(`Hi Loop Studios, I'd like to discuss a project with your team.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>WhatsApp DM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </Magnetic>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-sm editorial-glass rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-2 text-xs font-mono uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-black/5 dark:bg-white/10 font-bold text-[#0A0A0C] dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Home / Who We Are
            </button>
            <button
              onClick={() => handleNavClick('services', 'event-visuals')}
              className={`text-left px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'services'
                  ? 'bg-black/5 dark:bg-white/10 font-bold text-[#0A0A0C] dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Services & Rates
            </button>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Theme</span>
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-[#0A0A0C] dark:text-white"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-200" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Day Mode' : 'Night Mode'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10">
              <a
                href={getWhatsAppUrl(`Hi Loop Studios, I'd like to discuss a project with your team.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp DM (+94 76 843 9916)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
