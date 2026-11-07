import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Sun, Moon, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { LOGO_PATH, getWhatsAppUrl, PageView, SOCIAL_LINKS } from '../types.ts';
import { Magnetic } from './Magnetic.tsx';
import { auth, signOut, User } from '../firebase.ts';
import { TikTokIcon, InstagramIcon, FacebookIcon } from './SocialIcons.tsx';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      onNavigate('home');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleNavClick = (page: PageView, sectionId?: string) => {
    onNavigate(page, sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all">
      {/* Mobile Bar (< md): Clean full-width top bar with high opacity blur */}
      <div className="md:hidden w-full backdrop-blur-xl bg-white/90 dark:bg-[#050608]/90 border-b border-black/5 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
        >
          <svg 
              className="h-7 w-7 text-[#0A0A0C] dark:text-white transition-transform duration-300 group-hover:scale-105" 
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
          <span className="font-display font-semibold text-sm tracking-tight text-[#0A0A0C] dark:text-white">
            KULT <span className="text-slate-500 dark:text-slate-400 font-normal text-xs tracking-normal">STUDIOS</span>
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
            href={getWhatsAppUrl(`Hello KULT Studios, I would like to book a production consultation...`)}
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
        <div className="pointer-events-auto rounded-full editorial-glass shadow-2xl px-7 py-2.5 flex items-center justify-between gap-8 max-w-4xl w-full border border-black/5 dark:border-white/10 dark:border-t-white/20 backdrop-blur-xl bg-white/85 dark:bg-[#050608]/85">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-left group focus-visible:outline-none"
            >
              <svg 
                className="h-8 w-8 text-[#0A0A0C] dark:text-white transition-transform duration-300 group-hover:scale-105" 
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
              <span className="font-display font-semibold text-sm lg:text-base tracking-tight text-[#0A0A0C] dark:text-white group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors whitespace-nowrap">
                KULT <span className="text-slate-500 dark:text-slate-400 font-normal text-xs lg:text-sm tracking-normal">STUDIOS</span>
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

          {/* Right: Day/Night Toggle + Direct DM Pill Button + Client Profile / Sign Out */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser && (
              <div className="flex items-center gap-1.5 pr-1">
                <button
                  onClick={() => handleNavClick('portal')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition-colors"
                  title={`Signed in as ${currentUser.email}`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="max-w-[90px] truncate">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

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
                href={getWhatsAppUrl(`Hello KULT Studios, I would like to book a production consultation...`)}
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

            {currentUser && (
              <div className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <UserIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-cyan-300 truncate">{currentUser.displayName || currentUser.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-rose-400 hover:underline shrink-0 font-bold ml-2 cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

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

            {/* Follow KULT Studio Quick-Link Row */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Follow KULT Studio
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Official Channels</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-black/5 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-800 dark:text-slate-200 hover:text-cyan-400 transition-all text-[11px] font-mono"
                  title="TikTok @loop.studio4"
                >
                  <TikTokIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">TikTok</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-black/5 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-800 dark:text-slate-200 hover:text-pink-400 transition-all text-[11px] font-mono"
                  title="Instagram Loop Studio"
                >
                  <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Instagram</span>
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-black/5 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-slate-800 dark:text-slate-200 hover:text-blue-400 transition-all text-[11px] font-mono"
                  title="Facebook Loop Studio"
                >
                  <FacebookIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Facebook</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl(`Hello KULT Studios, I would like to book a production consultation...`)}
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
