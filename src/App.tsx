import React, { useState, useEffect } from 'react';
import { PageView } from './types.ts';
import { ParticleBackground } from './components/ParticleBackground.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './views/HomeView.tsx';
import { ServicesView } from './views/ServicesView.tsx';
import { ClientPortalView } from './views/ClientPortalView.tsx';
import { EventQuoteModal } from './components/EventQuoteModal.tsx';
import { GeminiChatWidget } from './components/GeminiChatWidget.tsx';
import { testConnection } from './firebase.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteServiceId, setQuoteServiceId] = useState<string | undefined>(undefined);

  // Day / Night Theme Engine (Default: Dark Mode)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('loop_theme');
      if (saved) return saved === 'dark';
    }
    return true; // Dark Mode (Default)
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('loop_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('loop_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    testConnection();
  }, []);

  // Handle URL hash changes or routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash.includes('portal') ||
        hash.includes('review') ||
        hash.includes('deliverables') ||
        hash.includes('client')
      ) {
        setCurrentPage('portal');
      } else if (
        hash.includes('services') ||
        hash.includes('rates') ||
        hash.includes('rate-card') ||
        hash.includes('retainers') ||
        hash.includes('event-visuals')
      ) {
        setCurrentPage('services');
      } else {
        setCurrentPage('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageView, sectionId?: string) => {
    setCurrentPage(page);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenQuoteModal = (serviceId?: string) => {
    setQuoteServiceId(serviceId);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuoteServiceId(undefined);
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] dark:bg-[#08090C] text-[#0A0A0C] dark:text-white transition-colors duration-300 overflow-x-hidden selection:bg-slate-300 dark:selection:bg-white/20">
      {/* Minimalist floating light grain canvas */}
      <ParticleBackground isDark={isDark} />

      {/* Custom magnetic cursor with physics and tactile shimmer */}
      <CustomCursor isDark={isDark} />

      {/* Floating pill frosted header with Day/Night toggle */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Router */}
      <main className="relative z-10 min-h-[calc(100vh-200px)]">
        {currentPage === 'home' ? (
          <HomeView
            onNavigate={handleNavigate}
            onOpenQuoteModal={() => handleOpenQuoteModal()}
            isDark={isDark}
          />
        ) : currentPage === 'services' ? (
          <ServicesView
            onOpenQuoteModal={(serviceId) => handleOpenQuoteModal(serviceId)}
            isDark={isDark}
          />
        ) : (
          <ClientPortalView
            isDark={isDark}
            onOpenVRViewer={() => handleNavigate('home', '360-vr')}
          />
        )}
      </main>

      {/* Minimalist Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        isDark={isDark}
      />

      {/* Bespoke Event Quote Modal */}
      <EventQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
        preselectedService={quoteServiceId}
      />

      {/* Floating Gemini AI Studio Assistant Widget */}
      <GeminiChatWidget isDark={isDark} />
    </div>
  );
}
