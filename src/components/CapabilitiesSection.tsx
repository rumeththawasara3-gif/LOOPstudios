import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { TiltCard } from './TiltCard.tsx';
import {
  PageView,
  ASSET_DRONE,
  ASSET_VR,
  ASSET_GIMBAL,
} from '../types.ts';

gsap.registerPlugin(ScrollTrigger);

interface CapabilitiesSectionProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
  isDark?: boolean;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onNavigate, isDark = true }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Pillar 1: Drone asset convergence
  const p1DroneRef = useRef<HTMLImageElement | null>(null);
  const p1GimbalRef = useRef<HTMLImageElement | null>(null);

  // Pillar 2: Timeline playhead & waveforms
  const p2PlayheadRef = useRef<SVGLineElement | null>(null);
  const p2WaveRef = useRef<SVGPathElement | null>(null);

  // Pillar 3: 360 VR coordinate ring & VR PNG
  const p3RingRef = useRef<SVGGElement | null>(null);
  const p3HeadsetRef = useRef<HTMLImageElement | null>(null);

  // Pillar 4: Trajectory growth curve
  const p4CurveRef = useRef<SVGPathElement | null>(null);
  const p4Node1Ref = useRef<SVGCircleElement | null>(null);
  const p4Node2Ref = useRef<SVGCircleElement | null>(null);
  const p4Node3Ref = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Pillar 1: Drone & Camera Gimbal converge on scroll down
      if (p1DroneRef.current && p1GimbalRef.current) {
        gsap.fromTo(
          p1DroneRef.current,
          { y: -60, scale: 0.8, opacity: 0.2, rotation: -8 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            rotation: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: p1DroneRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          p1GimbalRef.current,
          { x: 50, scale: 0.8, opacity: 0.2 },
          {
            x: 0,
            scale: 1,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: p1GimbalRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 2. Pillar 2: Timeline playhead slicing across waveform
      if (p2PlayheadRef.current && p2WaveRef.current) {
        gsap.fromTo(
          p2PlayheadRef.current,
          { x: -70 },
          {
            x: 70,
            ease: 'none',
            scrollTrigger: {
              trigger: p2PlayheadRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          p2WaveRef.current,
          { opacity: 0.2, strokeDashoffset: 100 },
          {
            opacity: 1,
            strokeDashoffset: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: p2WaveRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 3. Pillar 3: 360-degree rotational coordinate ring & VR headset PNG
      if (p3RingRef.current && p3HeadsetRef.current) {
        gsap.fromTo(
          p3RingRef.current,
          { rotate: -60, transformOrigin: 'center center' },
          {
            rotate: 60,
            transformOrigin: 'center center',
            ease: 'none',
            scrollTrigger: {
              trigger: p3RingRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        gsap.fromTo(
          p3HeadsetRef.current,
          {
            rotateY: 140,
            scale: 0.75,
            opacity: 0.2,
            transformPerspective: 1000,
          },
          {
            rotateY: 0,
            scale: 1,
            opacity: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: p3HeadsetRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 4. Pillar 4: Upward trajectory growth line & resolving nodes
      if (p4CurveRef.current && p4Node1Ref.current && p4Node2Ref.current && p4Node3Ref.current) {
        const length = p4CurveRef.current.getTotalLength?.() || 240;
        gsap.set(p4CurveRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.fromTo(
          p4CurveRef.current,
          { strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: p4CurveRef.current,
              start: 'top 80%',
              end: 'center center',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );

        [p4Node1Ref.current, p4Node2Ref.current, p4Node3Ref.current].forEach((node, idx) => {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0, transformOrigin: 'center center' },
            {
              scale: 1,
              opacity: 1,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: node,
                start: `${80 - idx * 10}%`,
                end: `${50 - idx * 10}%`,
                scrub: 1,
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 lg:px-8 max-w-7xl mx-auto py-20 sm:py-28 border-t border-black/10 dark:border-white/10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Agency Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0A0A0C] dark:text-white tracking-tight">
            Our Capabilities.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
            A cohesive 4-pillar production framework unifying on-site cinematography, viral retention engineering, immersive spatial technology, and client growth.
          </p>
        </div>

        <button
          onClick={() => onNavigate('services', 'event-visuals')}
          className="shrink-0 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors group"
        >
          <span>View Detailed Rates & Services</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* =========================================================================
            PILLAR 1: Full-Spectrum Event Coverage
            Synchronized drone & camera assets aligning on scroll
        ========================================================================= */}
        <TiltCard className="h-full">
          <div className="h-full p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
            <div>
              {/* Converging Custom Drone & Camera Asset Visual */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
                {/* Subtle telemetry circle */}
                <div className="absolute inset-4 rounded-full border border-black/10 dark:border-white/10 opacity-30 pointer-events-none" />

                <div className="relative w-full h-full flex items-center justify-center gap-4">
                  <img
                    ref={p1DroneRef}
                    src={ASSET_DRONE}
                    alt="Loop Studios Drone"
                    className="w-36 sm:w-44 h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_30px_rgba(255,255,255,0.06)] will-change-transform"
                  />
                  <img
                    ref={p1GimbalRef}
                    src={ASSET_GIMBAL}
                    alt="Loop Studios Gimbal Rig"
                    className="w-24 sm:w-28 h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_30px_rgba(255,255,255,0.06)] will-change-transform"
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                Pillar 01 · Unified Documentation
              </div>
              <h3 className="text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                Full-Spectrum Event Coverage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Coordinated multi-angle coverage bringing together cinematic video, drone perspectives, and signature event photography for unified visual documentation.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Video · Photo · Aerial</span>
              <span className="text-[#0A0A0C] dark:text-white font-medium">Bespoke Quote</span>
            </div>
          </div>
        </TiltCard>

        {/* =========================================================================
            PILLAR 2: Viral Retention & Post-Production
            Timeline playhead slicing across waveform tracks
        ========================================================================= */}
        <TiltCard className="h-full">
          <div className="h-full p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
                <svg
                  viewBox="0 0 240 140"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full text-slate-800 dark:text-slate-200"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="25" y="30" width="190" height="80" rx="4" />
                  <line x1="25" y1="48" x2="215" y2="48" strokeWidth="1" opacity="0.3" />
                  <line x1="25" y1="84" x2="215" y2="84" strokeWidth="1" opacity="0.3" />

                  <rect x="35" y="54" width="45" height="22" rx="2" className="fill-current opacity-15" />
                  <rect x="86" y="54" width="62" height="22" rx="2" className="fill-current opacity-25" />
                  <rect x="154" y="54" width="50" height="22" rx="2" className="fill-current opacity-15" />

                  <path
                    ref={p2WaveRef}
                    d="M 35 98 Q 44 88 53 98 T 71 98 T 89 98 T 107 98 T 125 98 T 143 98 T 161 98 T 179 98 T 204 98"
                    strokeWidth="1.2"
                  />

                  <line
                    ref={p2PlayheadRef}
                    x1="120"
                    y1="22"
                    x2="120"
                    y2="118"
                    strokeWidth="2"
                    className="stroke-[#0A0A0C] dark:stroke-white will-change-transform"
                  />
                  <polygon
                    points="116,22 124,22 120,29"
                    className="fill-[#0A0A0C] dark:fill-white"
                  />
                </svg>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                Pillar 02 · Algorithmic Retention
              </div>
              <h3 className="text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                Viral Retention & Post-Production
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Frame-by-frame hook engineering, dynamic pacing, custom kinetic typography, and high-impact sound design built for TikTok, Reels, and Shorts.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Shorts · Reels · TikTok</span>
              <span className="text-[#0A0A0C] dark:text-white font-medium">From LKR 1,000</span>
            </div>
          </div>
        </TiltCard>

        {/* =========================================================================
            PILLAR 3: Spatial & 360° VR Immersion
            Custom VR Box Headset rotating inside coordinate ring
        ========================================================================= */}
        <TiltCard className="h-full">
          <div className="h-full p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
                {/* 360-degree Rotational Coordinate Ring SVG */}
                <svg
                  viewBox="0 0 240 140"
                  fill="none"
                  stroke="currentColor"
                  className="absolute inset-0 w-full h-full text-slate-800 dark:text-slate-200"
                  strokeWidth="1.2"
                >
                  <g ref={p3RingRef} className="will-change-transform">
                    <ellipse cx="120" cy="70" rx="95" ry="36" strokeDasharray="4 4" opacity="0.3" />
                    <circle cx="25" cy="70" r="3" className="fill-current" />
                    <circle cx="215" cy="70" r="3" className="fill-current" />
                    <line x1="120" y1="28" x2="120" y2="34" strokeWidth="2" />
                    <line x1="120" y1="106" x2="120" y2="112" strokeWidth="2" />
                  </g>
                </svg>

                {/* Custom Transparent VR Headset PNG */}
                <div className="relative z-10 w-44 sm:w-52 h-auto flex items-center justify-center">
                  <img
                    ref={p3HeadsetRef}
                    src={ASSET_VR}
                    alt="Loop Studios VR Headset"
                    className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_30px_rgba(255,255,255,0.06)] will-change-transform"
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                Pillar 03 · Spatial Reality
              </div>
              <h3 className="text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                Spatial & 360° VR Immersion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Interactive spherical event capture engineered for full immersion across smartphones, desktop browsers, and VR headsets.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Mobile Gyro · VR Box</span>
              <span className="text-[#0A0A0C] dark:text-white font-medium">Special Upgrade</span>
            </div>
          </div>
        </TiltCard>

        {/* =========================================================================
            PILLAR 4: Strategic Digital Distribution & Growth
            Clean upward trajectory vector line with smooth data nodes
        ========================================================================= */}
        <TiltCard className="h-full">
          <div className="h-full p-8 rounded-2xl editorial-glass flex flex-col justify-between group">
            <div>
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 flex items-center justify-center p-4">
                <svg
                  viewBox="0 0 240 140"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full text-slate-800 dark:text-slate-200"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="35" y1="115" x2="205" y2="115" strokeWidth="1" opacity="0.2" />
                  <line x1="35" y1="25" x2="35" y2="115" strokeWidth="1" opacity="0.2" />

                  <path
                    ref={p4CurveRef}
                    d="M 35 110 C 80 108 120 78 150 56 S 190 32 205 30"
                    strokeWidth="2.5"
                    className="stroke-[#0A0A0C] dark:stroke-white will-change-[stroke-dashoffset]"
                  />

                  <g ref={p4Node1Ref} className="will-change-transform">
                    <circle cx="95" cy="98" r="4.5" className="fill-[#0A0A0C] dark:fill-white" />
                    <circle cx="95" cy="98" r="8" opacity="0.3" strokeDasharray="2 2" />
                  </g>

                  <g ref={p4Node2Ref} className="will-change-transform">
                    <circle cx="150" cy="56" r="4.5" className="fill-[#0A0A0C] dark:fill-white" />
                    <circle cx="150" cy="56" r="8" opacity="0.3" strokeDasharray="2 2" />
                  </g>

                  <g ref={p4Node3Ref} className="will-change-transform">
                    <circle cx="205" cy="30" r="5" className="fill-[#0A0A0C] dark:fill-white" />
                    <circle cx="205" cy="30" r="10" opacity="0.4" />
                  </g>
                </svg>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                Pillar 04 · Turnkey Growth
              </div>
              <h3 className="text-2xl font-bold text-[#0A0A0C] dark:text-white mb-3">
                Strategic Digital Distribution & Growth
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Content calendar architecture, audience targeting, and end-to-end community and social media management engineered to turn viewers into clients.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Omnichannel Retainers</span>
              <span className="text-[#0A0A0C] dark:text-white font-medium">From LKR 25,000/mo</span>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
