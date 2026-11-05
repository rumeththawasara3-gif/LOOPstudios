import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EditorialPhotoFrame } from './EditorialPhotoFrame.tsx';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 1. DRONE & AERIAL SECTION
// Luxury Editorial Photo Card with smooth parallax reveal
// =========================================================================
export const DroneAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          y: -40,
          scale: 0.95,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="drone-block relative p-6 sm:p-8 rounded-2xl md:rounded-3xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <EditorialPhotoFrame
            src="/images/service-aerial.jpg"
            fallbackSrc="https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1600&auto=format&fit=crop"
            alt="Aerial Cinematic Perspectives"
            badge="AERIAL CINEMA"
            gearCutoutSrc="/drone.png"
            gearName="4K HDR Aerial Cinema Drone"
            aspectRatio="cinema"
          />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
          CINEMATIC AERIAL PERSPECTIVES
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Drone & Scale Capture
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Fluid multi-axis altitude sweeps, architectural framing, and high-altitude venue perspectives deployed seamlessly by licensed commercial pilots.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
            4K 60P HDR
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            D-LOG M 10-BIT
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            ISLANDWIDE DISPATCH
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 360° & VR IMMERSION SECTION
// =========================================================================
export const VRHeadsetAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          scale: 0.92,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        {
          scale: 0.96,
          opacity: 0,
          y: 25,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="vr-block relative p-6 sm:p-8 rounded-2xl md:rounded-3xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
    >
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <EditorialPhotoFrame
            src="/images/service-360.jpg"
            fallbackSrc="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1600&auto=format&fit=crop"
            alt="360 Spatial & Virtual Immersion"
            badge="360° SPATIAL"
            gearCutoutSrc="/vrbox.png"
            gearName="8K Spatial Immersion VR Headset"
            aspectRatio="cinema"
          />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-purple-400 uppercase font-semibold">
          RECORDED 360° VIDEO // SPATIAL IMMERSION
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          360° Memory Capture
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          We record your entire event or space in immersive 360° video. We deliver a ready-to-view experience so anyone can re-watch and experience the moment from anywhere, anytime on any smartphone or with a VR headset.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-purple-400">
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 font-bold">
            PLAY ON ANY PHONE
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            VR HEADSET READY
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            ONLINE CLOUD HOSTED
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CINEMA VIDEOGRAPHY & GIMBAL SECTION
// =========================================================================
export const CinemaGimbalAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          x: 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        {
          x: -30,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="video-block relative p-6 sm:p-8 rounded-2xl md:rounded-3xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <EditorialPhotoFrame
            src="/images/service-production.jpg"
            fallbackSrc="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop"
            alt="Cinema Event Production & Videography"
            badge="EVENT PRODUCTION"
            gearCutoutSrc="/gimble.png"
            gearName="DJI RS4 Motorized Cinema Gimbal"
            aspectRatio="cinema"
          />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
          CINEMA PRODUCTION // MASTER RECAPS
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Cinematic Videography & Recap Films
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          3-axis motorized gimbal stabilization, deliberate anamorphic prime focal lengths, stage-matched color profiles, and 32-bit float audio multi-track recording.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
            PRORES 422 HQ
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            32-BIT FLOAT AUDIO
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            3-AXIS GIMBAL
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. SIGNATURE PHOTOGRAPHY SECTION
// =========================================================================
export const OpticsSnapAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          scale: 0.95,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="photo-block relative p-6 sm:p-8 rounded-2xl md:rounded-3xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
    >
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <EditorialPhotoFrame
            src="/images/service-production.jpg"
            fallbackSrc="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop"
            alt="Signature Event Photography"
            badge="FINE-ART STILLS"
            gearCutoutSrc="/cam.png"
            gearName="Canon EOS Full-Frame Optical Rig"
            aspectRatio="cinema"
          />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-purple-400 uppercase font-semibold">
          FINE-ART EDITORIAL STILLS
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Signature Event Photography
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Editorial event photography delivering uncompressed RAW assets and master color retouches calibrated for keynote speakers, audience energy, and stage lighting.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-purple-400">
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 font-bold">
            UNCOMPRESSED RAW
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            COLOR MATCHED
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            SAME-DAY HIGHLIGHTS
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. SHORT-FORM EDITING SECTION
// =========================================================================
export const EditingTimelineAnimationBlock: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl editorial-glass p-4 sm:p-6 select-none overflow-hidden border border-cyan-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="mb-4 flex items-center justify-between text-xs font-mono text-cyan-400">
        <span className="font-bold tracking-wider">RETENTION EDITING SUITE // MASTERING</span>
        <span className="text-[10px] text-slate-400">9:16 VERTICAL HOOKS</span>
      </div>
      <EditorialPhotoFrame
        src="/images/service-editing.jpg"
        fallbackSrc="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1600&auto=format&fit=crop"
        alt="Viral Retention Editing Suite"
        badge="VIRAL RETENTION"
        aspectRatio="cinema"
      />
    </div>
  );
};
