import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Camera, Sparkles, Check, Smartphone, Glasses, Cloud } from 'lucide-react';
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
        {/* Soft Ambient Light Bloom behind Hero headline */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full blur-[130px] bg-cyan-500/10 pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="space-y-6 sm:space-y-8 relative z-10">
          {/* Subtle Metadata Eyebrow with Ultra-Wide Tracking */}
          <div className="hero-fade-item inline-flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
            <span>High-End Event Media</span>
            <span className="opacity-40 text-slate-500" aria-hidden="true">✦</span>
            <span>Strategic Retention</span>
            <span className="opacity-40 text-slate-500" aria-hidden="true">✦</span>
            <span className="text-white">Available Worldwide</span>
          </div>

          {/* Primary High-Impact Typography with Metallic / Silver Sheen */}
          <h1 className="hero-fade-item font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent leading-[1.06] [text-wrap:balance]">
            Cinema-Grade Production. <br />
            <span className="font-normal text-slate-300">
              Engineered for Viral Growth.
            </span>
          </h1>

          {/* Narrative copy */}
          <p className="hero-fade-item text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed [text-wrap:balance]">
            KULT Studios unites editorial cinema production with data-driven social retention engineering. We deliver multi-crew event coverage, viral short-form edits, and turnkey brand retainers.
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
                href={getWhatsAppUrl(`Hello KULT Studios, I would like to book a production consultation...`)}
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
              “KULT is a full-stack digital content and social media agency built for the modern creator economy. We understand that in today’s digital ecosystem, a great video isn't enough—it needs to be strategically optimized, actively managed, and designed to convert. We bridge the gap between creative visual storytelling and strategic digital marketing.”
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
          SECTION D: 360° MEMORY CAPTURE — RECORDED VIDEO & PLAYBACK ANYWHERE
      ========================================================================= */}
      <section id="360-vr" className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-32 border-t border-black/10 dark:border-white/10">
        {/* Exact Requested Headline & Copy */}
        <div className="mb-10 sm:mb-14 max-w-3xl space-y-4">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
            Recorded 360° Video & Playback Anywhere
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-[#0A0A0C] dark:text-white tracking-tight leading-tight cinema-gradient-text">
            360° Memory Capture
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-cyan-400 dark:text-cyan-300">
            Relive the moment from any angle, any day.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
            We record your entire event or space in immersive 360° video. We deliver a ready-to-view experience so you, your guests, or your clients can watch the moment back on any smartphone or with a VR headset—no complicated apps, completely hosted online for you to access from anywhere, anytime.
          </p>
        </div>

        {/* 3 Feature Highlights: Simple Mobile Playback, VR Ready, Unlimited Cloud Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-14">
          {/* Card 1: Simple Mobile Playback */}
          <div className="p-6 sm:p-7 rounded-2xl md:rounded-3xl editorial-glass border border-white/10 transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase font-semibold mb-1.5">
              Instant Mobile Experience
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0C] dark:text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Play on Any Phone
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Just click, drag, or tilt your phone to look around the space naturally in full cinematic 360°.
            </p>
          </div>

          {/* Card 2: Virtual Reality Ready */}
          <div className="p-6 sm:p-7 rounded-2xl md:rounded-3xl editorial-glass border border-white/10 transition-all duration-300 hover:border-purple-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Glasses className="w-6 h-6" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-purple-400 uppercase font-semibold mb-1.5">
              Hardware Independent
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0C] dark:text-white mb-2 group-hover:text-purple-300 transition-colors">
              VR Immersive Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Slip on any VR headset to instantly transport back to the center of the crowd.
            </p>
          </div>

          {/* Card 3: Unlimited Cloud Access */}
          <div className="p-6 sm:p-7 rounded-2xl md:rounded-3xl editorial-glass border border-white/10 transition-all duration-300 hover:border-blue-400/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cloud className="w-6 h-6" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-blue-400 uppercase font-semibold mb-1.5">
              Hosted Web Link
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0A0A0C] dark:text-white mb-2 group-hover:text-blue-300 transition-colors">
              Access Anywhere, Any Day
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
              Your recorded spatial experience is safely stored, ready to show off or relive whenever you want.
            </p>
          </div>
        </div>

        {/* Interactive 360° Review Player with Rotating Navigation Controls */}
        <Panorama360Viewer />
      </section>

      {/* =========================================================================
          SECTION E: BASE LOCATION & DIRECT DISPATCH CONTACT
      ========================================================================= */}
      <section className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-16 md:py-24 border-t border-black/10 dark:border-white/10">
        <div className="rounded-3xl p-8 sm:p-12 editorial-glass border border-black/10 dark:border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://maps.app.goo.gl/kzwf9SkoCJSia1J37"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 dark:text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono tracking-wide transition-all shadow-sm group"
                title="Open Studio Base Location on Google Maps"
              >
                <span>📍 Base: Sri Lanka · Islandwide & Global On-Site Dispatch</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight cinema-gradient-text">
              Lock In Your Event Date.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 font-light leading-relaxed">
              We deploy full multi-crew productions (Videographers, Photographers, 4K Drone Operators, and 360° VR Spatial Engineers) across Colombo, Kandy, Galle, and internationally.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto shrink-0">
            <a
              href={getWhatsAppUrl(`Hello KULT Studios, I would like to check event availability and request a custom quote.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all active:scale-95"
            >
              <span>Connect on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => onOpenQuoteModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-mono uppercase tracking-wider transition-all text-[#0A0A0C] dark:text-white cursor-pointer"
            >
              <span>Request Custom Quote</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
