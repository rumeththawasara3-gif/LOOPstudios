import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { TiltCard } from './TiltCard.tsx';
import { PageView } from '../types.ts';
import {
  DroneRadarHUD,
  CinemaCameraHUD,
  SpatialGyroHUD,
  RetentionWaveformHUD,
} from './CinemaHUDs.tsx';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesSectionProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  isDark?: boolean;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onNavigate, isDark = true }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Track scroll progress to pass to interactive HUD elements
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress * 360);
        },
      });

      // Staggered card entrance reveal
      const cards = sectionRef.current?.querySelectorAll('.capability-card-item');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-20 md:py-32 border-t border-white/10"
    >
      {/* Header with Cinema Glow */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="max-w-2xl space-y-3">
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
            Visual Production Systems
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white cinema-gradient-text">
            Our Capabilities.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 font-light leading-relaxed">
            A cohesive 4-pillar production framework unifying on-site cinematography, viral retention engineering, immersive spatial technology, and client growth.
          </p>
        </div>

        <button
          onClick={() => onNavigate('services', 'event-visuals')}
          className="shrink-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-cyan-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span>View Rates & Retainers</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 4-Pillar Grid with Dynamic Director HUD Viewfinders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {/* =========================================================================
            PILLAR 1: Full-Spectrum Event Coverage (AERIAL DRONE RADAR HUD)
        ========================================================================= */}
        <div className="capability-card-item h-full">
          <TiltCard className="h-full" spotlightColor="rgba(0, 242, 254, 0.15)">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
              <div>
                {/* Director's Viewfinder HUD */}
                <div className="mb-6">
                  <DroneRadarHUD scrollRotation={scrollProgress} />
                </div>

                <div className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-cyan-400 uppercase font-semibold mb-1.5">
                  Pillar 01 · Aerial & Field Recon
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Full-Spectrum Event Coverage
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Coordinated multi-angle deployment pairing high-altitude cinema drone perspectives with low-light camera rigs for unified visual documentation.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400/80">4K 60P · Multi-Crew Dispatch</span>
                <span className="text-white font-medium">Bespoke Quote</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 2: Viral Retention & Post-Production (RETENTION HUD)
        ========================================================================= */}
        <div className="capability-card-item h-full">
          <TiltCard className="h-full" spotlightColor="rgba(79, 172, 254, 0.15)">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
              <div>
                {/* Retention Waveform HUD */}
                <div className="mb-6">
                  <RetentionWaveformHUD />
                </div>

                <div className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-cyan-400 uppercase font-semibold mb-1.5">
                  Pillar 02 · Algorithmic Retention
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Viral Retention & Post-Production
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Frame-by-frame sub-second hook framing, dynamic pacing, custom kinetic typography, and high-impact sound design built for TikTok, Reels, and Shorts.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-cyan-400/80">Sub-Second Hooks · Dynamic Pacing</span>
                <span className="text-white font-medium">From LKR 1,000</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 3: Spatial & 360° VR Immersion (GYRO SPHERE HUD)
        ========================================================================= */}
        <div className="capability-card-item h-full">
          <TiltCard className="h-full" spotlightColor="rgba(225, 0, 255, 0.15)">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
              <div>
                {/* 360 Gyro Sphere HUD */}
                <div className="mb-6">
                  <SpatialGyroHUD />
                </div>

                <div className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-purple-400 uppercase font-semibold mb-1.5">
                  Pillar 03 · Spatial Immersion
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Spatial & 360° VR Immersion
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Interactive spherical event capture engineered for full immersion across smartphones (pan/gyro), desktop browsers, or Apple Vision Pro / Meta Quest headsets.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-purple-400/80">8K Equirect · Mobile Gyroscope</span>
                <span className="text-white font-medium">Special Upgrade</span>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* =========================================================================
            PILLAR 4: Cinema Optics & Gimbal Master (ARRI/RED VIEWFINDER HUD)
        ========================================================================= */}
        <div className="capability-card-item h-full">
          <TiltCard className="h-full" spotlightColor="rgba(127, 0, 255, 0.15)">
            <div className="h-full p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
              <div>
                {/* Cinema Viewfinder HUD */}
                <div className="mb-6">
                  <CinemaCameraHUD />
                </div>

                <div className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-purple-400 uppercase font-semibold mb-1.5">
                  Pillar 04 · Cinema Optics & Rigging
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Anamorphic Prime & Gimbal Control
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  3-axis motorized gimbal stabilization, deliberate anamorphic focal lengths, stage-matched color profiles, and 32-bit float audio multi-track recording.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-purple-400/80">ProRes 4444 · 2.39:1 Scope</span>
                <span className="text-white font-medium">Custom Ingestion</span>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
};
