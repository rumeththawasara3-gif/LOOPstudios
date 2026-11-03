import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Camera, Sparkles, Check } from 'lucide-react';
import {
  BRAND_NAME,
  getWhatsAppUrl,
  PageView,
} from '../types.ts';
import { TiltCard } from '../components/TiltCard.tsx';
import { Magnetic } from '../components/Magnetic.tsx';
import { Panorama360Viewer } from '../components/Panorama360Viewer.tsx';
import { CapabilitiesSection } from '../components/CapabilitiesSection.tsx';
import { MarqueeTicker } from '../components/MarqueeTicker.tsx';

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  onOpenQuoteModal: () => void;
  isDark?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenQuoteModal, isDark = true }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const narrativeRef = useRef<HTMLDivElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  // GSAP Bidirectional ScrollTrigger Setup (scrub: 1, toggleActions: "play reverse play reverse")
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('.hero-fade-item'),
          { y: 35, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current,
          { opacity: 0.15, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      if (metricsRef.current) {
        const items = metricsRef.current.querySelectorAll('.metric-badge-item');
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative z-10 overflow-hidden">
      {/* =========================================================================
          SECTION A: HERO BANNER
          Explicit top padding pt-28 md:pt-40 to prevent collision with fixed navbar
      ========================================================================= */}
      {/* =========================================================================
          SECTION A: HERO BANNER
          Explicit top padding pt-28 md:pt-40 to prevent collision with fixed navbar
      ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[75vh] flex flex-col justify-center px-5 sm:px-8 md:px-12 max-w-5xl mx-auto pt-28 md:pt-40 pb-16 md:pb-24"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Subtle Metadata Eyebrow with Ultra-Wide Tracking */}
          <div className="hero-fade-item inline-flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
            <span>High-End Event Media</span>
            <span className="opacity-40 text-slate-500" aria-hidden="true">✦</span>
            <span>Strategic Retention</span>
            <span className="opacity-40 text-slate-500" aria-hidden="true">✦</span>
            <span className="text-white">Available Worldwide</span>
          </div>

          {/* Primary High-Impact Typography with Cinema Gradient */}
          <h1 className="hero-fade-item font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight cinema-gradient-text leading-[1.06] [text-wrap:balance]">
            Cinema-Grade Production. <br />
            <span className="font-normal text-slate-300">
              Engineered for Viral Growth.
            </span>
          </h1>

          {/* Narrative copy */}
          <p className="hero-fade-item text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed [text-wrap:balance]">
            Loop Studios unites editorial cinema production with data-driven social retention engineering. We deliver multi-crew event coverage, viral short-form edits, and turnkey brand retainers.
          </p>

          {/* Key Metrics Badges */}
          <div
            ref={metricsRef}
            className="hero-fade-item flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 text-xs font-mono"
          >
            <div className="metric-badge-item px-3.5 py-1.5 rounded-full editorial-glass text-white font-medium flex items-center gap-2 border-t border-cyan-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
              <span>5–7 Days Turnaround (Delivery)</span>
            </div>

            <div className="metric-badge-item px-3.5 py-1.5 rounded-full editorial-glass text-white font-medium flex items-center gap-2 border-t border-cyan-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span>High-Hook Retention (Reels & Shorts)</span>
            </div>

            <div className="metric-badge-item px-3.5 py-1.5 rounded-full editorial-glass text-white font-medium flex items-center gap-2 border-t border-purple-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span>Full Pipeline (Shoot to Growth)</span>
            </div>
          </div>

          {/* Primary CTAs with Electric Glow */}
          <div className="hero-fade-item flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3">
            <Magnetic strength={0.25}>
              <button
                onClick={() => onNavigate('services', 'event-visuals')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] text-xs sm:text-sm font-semibold rounded-full bg-gradient-to-r from-white via-cyan-100 to-cyan-300 text-black hover:opacity-95 transition-all shadow-[0_0_30px_rgba(0,242,254,0.35)] active:scale-95 cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href={getWhatsAppUrl(`Hi Loop Studios, I'd like to start a project with your team.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 min-h-[44px] text-xs sm:text-sm font-medium rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-cyan-400/50 transition-all active:scale-95 shadow-md"
              >
                <span>Start a Project / WhatsApp DM</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INFINITE VELOCITY MARQUEE TICKER TAPE
          Sleek horizontal drifting tape separating Hero and Agency sections
      ========================================================================= */}
      <MarqueeTicker />

      {/* =========================================================================
          SECTION B: NARRATIVE & AGENCY ARCHITECTURE
      ========================================================================= */}
      <section
        ref={narrativeRef}
        className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
              Agency Architecture
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight leading-tight">
              Bridging Creative Storytelling & Strategic Growth.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg md:text-xl text-[#0A0A0C] dark:text-white font-light leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-4 sm:pl-6">
              “Loop is a full-stack digital content and social media agency built for the modern creator economy. We understand that in today’s digital ecosystem, a great video isn't enough—it needs to be strategically optimized, actively managed, and designed to convert. We bridge the gap between creative visual storytelling and strategic digital marketing.”
            </p>
          </div>
        </div>

        {/* Highlight Feature Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <TiltCard className="h-full">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0A0A0C] dark:text-white flex items-center justify-center mb-6">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-2">
                  Visual Benchmark
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                  Cinema Optics
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                  High-definition, beautifully graded visual assets with deliberate lens selections, stage-matched color profiles, and fluid aerial drone perspectives.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <Check className="w-3.5 h-3.5 text-current shrink-0" />
                <span>4K Master grading · Multicam sync · Fluid aerial lines</span>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0A0A0C] dark:text-white flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-2">
                  Acquisition Mechanics
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                  Growth Focus
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                  Conversion-led systems engineered for client acquisition. Sub-second hooks, kinetic pacing, and omnichannel distribution designed to drive customer inquiries and tuition enrollment.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                <Check className="w-3.5 h-3.5 text-current shrink-0" />
                <span>Direct conversion pipelines · Algorithmic retention</span>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: OUR CAPABILITIES (REPLACES TEAM ROSTER)
          4-Pillar framework with bidirectional GSAP animated wireframes & generous whitespace
      ========================================================================= */}
      <CapabilitiesSection onNavigate={onNavigate} isDark={isDark} />

      {/* =========================================================================
          SECTION D: INNOVATION PREVIEW — 360° SPATIAL FEATURE
      ========================================================================= */}
      <section className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10">
        <div className="mb-10 sm:mb-12 max-w-2xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
            Innovation Preview
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight leading-tight">
            360° Spatial Feature.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            Experience the entire venue from smartphones (pan/gyro), desktop browsers, or VR headsets. Full spherical coverage preserving every angle of your landmark event.
          </p>
        </div>

        {/* Interactive Horizontal 360 Panoramic Simulator */}
        <Panorama360Viewer />
      </section>
    </div>
  );
};
