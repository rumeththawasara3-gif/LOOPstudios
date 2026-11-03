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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all">
      {/* Mobile Bar (< md): Clean full-width top bar with high opacity blur */}
      <div className="md:hidden w-full backdrop-blur-xl bg-white/90 dark:bg-[#08090C]/90 border-b border-black/5 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
        >
          {!logoError ? (
            <img
              src={LOGO_PATH}
              alt="Loop Studios Logo"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className={`h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                isDark ? 'brightness-125' : 'brightness-0'
              }`}
            />
          ) : (
            <span className="text-xl font-bold tracking-tighter text-[#0A0A0C] dark:text-white">
              ∞
            </span>
          )}
          <span className="font-display font-semibold text-sm tracking-tight text-[#0A0A0C] dark:text-white">
            LOOP <span className="text-slate-500 dark:text-slate-400 font-normal text-xs tracking-normal">STUDIOS</span>
          </span>
        </button>

        {/* Compact Right Control Group (Theme switch + WhatsApp + Menu Toggle) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Day / Night Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 min-h-[40px] min-w-[40px] rounded-full bg-black/5 dark:bg-white/10 text-[#0A0A0C] dark:text-white flex items-center justify-center transition-all active:scale-90"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Direct WhatsApp Quick Link */}
          <a
            href={getWhatsAppUrl(`Hi Loop Studios, I'd like to discuss a project with your team.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 min-h-[40px] min-w-[40px] rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black flex items-center justify-center transition-all active:scale-95"
            title="Chat on WhatsApp"
            aria-label="Direct WhatsApp DM"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[40px] min-w-[40px] rounded-full text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Floating Pill (md:flex): Centered horizontally */}
      <div className="hidden md:flex justify-center pt-4 px-6 pointer-events-none">
        <div className="pointer-events-auto rounded-full editorial-glass shadow-2xl px-7 py-2.5 flex items-center justify-between gap-8 max-w-4xl w-full border border-black/5 dark:border-white/10 backdrop-blur-xl bg-white/85 dark:bg-[#08090C]/85">
          {/* Left: Brand Logo */}
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
                  className={`h-7 lg:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                    isDark ? 'brightness-125' : 'brightness-0'
                  }`}
                />
              ) : (
                <span className="text-xl font-bold tracking-tighter text-[#0A0A0C] dark:text-white">
                  ∞
                </span>
              )}
              <span className="font-display font-semibold text-sm lg:text-base tracking-tight text-[#0A0A0C] dark:text-white group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors whitespace-nowrap">
                LOOP <span className="text-slate-500 dark:text-slate-400 font-normal text-xs lg:text-sm tracking-normal">STUDIOS</span>
              </span>
            </button>
          </div>

          {/* Center: Minimal Nav Links */}
          <nav className="flex items-center gap-8 text-xs font-medium tracking-wide uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap relative py-1 cursor-pointer ${
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
              className={`transition-colors whitespace-nowrap relative py-1 cursor-pointer ${
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

            <button
              onClick={() => handleNavClick('portal')}
              className={`transition-colors whitespace-nowrap relative py-1 cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'portal'
                  ? 'text-[#0A0A0C] dark:text-white font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0A0A0C] dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Client Portal</span>
              {currentPage === 'portal' && (
                <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#0A0A0C] dark:bg-white" />
              )}
            </button>
          </nav>

          {/* Right: Day/Night Toggle + Direct DM Pill Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Magnetic strength={0.2}>
              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#0A0A0C] dark:text-white transition-all active:scale-90 cursor-pointer"
                title={isDark ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-200 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href={getWhatsAppUrl(`Hi Loop Studios, I'd like to discuss a project with your team.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-full bg-[#0A0A0C] text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
              >
                <span>WhatsApp DM</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-black/5 dark:border-white/10 backdrop-blur-2xl bg-white/95 dark:bg-[#08090C]/95 px-5 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 text-xs font-mono uppercase">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-4 py-3 rounded-xl min-h-[44px] flex items-center transition-colors ${
                currentPage === 'home'
                  ? 'bg-black/5 dark:bg-white/10 font-bold text-[#0A0A0C] dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Home / Who We Are
            </button>
            <button
              onClick={() => handleNavClick('services', 'event-visuals')}
              className={`text-left px-4 py-3 rounded-xl min-h-[44px] flex items-center transition-colors ${
                currentPage === 'services'
                  ? 'bg-black/5 dark:bg-white/10 font-bold text-[#0A0A0C] dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Services & Rates
            </button>
            <button
              onClick={() => handleNavClick('portal')}
              className={`text-left px-4 py-3 rounded-xl min-h-[44px] flex items-center justify-between transition-colors ${
                currentPage === 'portal'
                  ? 'bg-black/5 dark:bg-white/10 font-bold text-[#0A0A0C] dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>Client Portal (Review & Milestones)</span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </button>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between px-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Current Theme</span>
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono text-[#0A0A0C] dark:text-white min-h-[40px]"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-200" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl(`Hi Loop Studios, I'd like to discuss a project with your team.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] py-3 text-xs font-semibold rounded-xl bg-[#0A0A0C] text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 shadow-md active:scale-98"
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
