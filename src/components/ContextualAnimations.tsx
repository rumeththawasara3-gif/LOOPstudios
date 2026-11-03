import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ASSET_DRONE,
  ASSET_VR,
  ASSET_GIMBAL,
  ASSET_CAMERA,
} from '../types.ts';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 1. DRONE & AERIAL SECTION
// Custom PNG: Transparent DJI Drone
// Start: y: -140px, scale: 0.7, rotation: -12deg, opacity: 0
// End: y: 0, scale: 1, rotation: 0deg, opacity: 1
// Text: "Drone & Scale Capture"
// =========================================================================
export const DroneAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const droneImgRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !droneImgRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Drone sweeps down, levels off, and scales up
      gsap.fromTo(
        droneImgRef.current,
        {
          y: -140,
          scale: 0.7,
          rotation: -12,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          rotation: 0,
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

      // Text slides up and sharpens as the drone settles
      gsap.fromTo(
        textRef.current,
        {
          y: 40,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
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
      className="drone-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden select-none"
    >
      <div ref={textRef} className="space-y-2 max-w-xl will-change-[transform,opacity,filter]">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          AERIAL KINETICS
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Drone & Scale Capture
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Fluid multi-axis altitude sweeps and high-altitude architectural venue perspectives deployed seamlessly by licensed pilots.
        </p>
      </div>

      {/* Custom Transparent PNG Asset: Drone */}
      <div className="w-full md:w-auto flex items-center justify-center shrink-0">
        <div className="relative w-64 sm:w-80 max-w-[340px] aspect-[4/3] flex items-center justify-center">
          <img
            ref={droneImgRef}
            src={ASSET_DRONE}
            alt="Loop Studios Aerial Drone"
            className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_25px_40px_rgba(255,255,255,0.08)] will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 360° & VR IMMERSION SECTION
// Custom PNG: Transparent VR Box Headset
// Start: rotationY: 180deg, rotationZ: -10deg, scale: 0.75, opacity: 0
// End: rotationY: 0deg, rotationZ: 0deg, scale: 1, opacity: 1
// Text: "360° VR Immersion"
// =========================================================================
export const VRHeadsetAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vrImgRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !vrImgRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // 3D Spatial rotation into normal view
      gsap.fromTo(
        vrImgRef.current,
        {
          rotateY: 180,
          rotateZ: -10,
          scale: 0.75,
          opacity: 0,
          transformPerspective: 1000,
        },
        {
          rotateY: 0,
          rotateZ: 0,
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

      // Text expands with subtle perspective reveal
      gsap.fromTo(
        textRef.current,
        {
          scale: 0.94,
          opacity: 0,
          y: 30,
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
      className="vr-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden select-none"
    >
      <div ref={textRef} className="space-y-2 max-w-xl will-change-transform">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          SPATIAL RECORDING
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          360° VR Immersion
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Full-sphere event recordings enabling attendees and stakeholders to relive the venue in interactive 360° via mobile gyroscopes, desktop click-drag, or VR headsets.
        </p>
      </div>

      {/* Custom Transparent PNG Asset: VR Headset */}
      <div className="w-full md:w-auto flex items-center justify-center shrink-0">
        <div
          className="relative w-64 sm:w-80 max-w-[340px] aspect-[4/3] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          <img
            ref={vrImgRef}
            src={ASSET_VR}
            alt="Loop Studios 360 VR Headset"
            className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_25px_40px_rgba(255,255,255,0.08)] will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CINEMA VIDEOGRAPHY SECTION
// Custom PNG: Transparent Gimbal + Camera Rig
// Start: x: -120px, rotation: -18deg, filter: blur(8px), opacity: 0
// End: x: 0px, rotation: 0deg, filter: blur(0px), opacity: 1
// Text: "Cinema Videography"
// =========================================================================
export const CinemaGimbalAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gimbalImgRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !gimbalImgRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Glides across, stabilizes to level axis, and unblurs
      gsap.fromTo(
        gimbalImgRef.current,
        {
          x: -120,
          rotation: -18,
          filter: 'blur(8px)',
          opacity: 0,
        },
        {
          x: 0,
          rotation: 0,
          filter: 'blur(0px)',
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

      // Text unblurs in sync with the gimbal stabilization
      gsap.fromTo(
        textRef.current,
        {
          filter: 'blur(14px)',
          opacity: 0.1,
          y: 30,
        },
        {
          filter: 'blur(0px)',
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
      className="video-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden select-none"
    >
      <div ref={textRef} className="space-y-2 max-w-xl will-change-[filter,opacity,transform]">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          STABILIZED CINEMA
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Cinema Videography
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Fluid multi-axis mechanical stabilization, narrative highlight recaps, intentional anamorphic framing, and venue-grade audio calibration.
        </p>
      </div>

      {/* Custom Transparent PNG Asset: Gimbal Rig */}
      <div className="w-full md:w-auto flex items-center justify-center shrink-0">
        <div className="relative w-56 sm:w-72 max-w-[320px] h-[260px] sm:h-[300px] flex items-center justify-center">
          <img
            ref={gimbalImgRef}
            src={ASSET_GIMBAL}
            alt="Loop Studios 3-Axis Gimbal Rig"
            className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_25px_40px_rgba(255,255,255,0.08)] will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. SIGNATURE PHOTOGRAPHY SECTION
// Custom PNG: Transparent Professional Camera Body with Prime Optical Lens
// Start: scale: 0.75, rotation: 14deg, filter: blur(10px), opacity: 0
// End: scale: 1, rotation: 0deg, filter: blur(0px), opacity: 1, tactile snap pulse
// Text: "Signature Photography"
// =========================================================================
export const OpticsSnapAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraImgRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !cameraImgRef.current || !textRef.current || !frameBoxRef.current) return;

    const ctx = gsap.context(() => {
      // Dynamic focus zoom and frame snap into crisp focus
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        cameraImgRef.current,
        {
          scale: 0.75,
          rotation: 14,
          filter: 'blur(10px)',
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          filter: 'blur(0px)',
          opacity: 1,
          ease: 'power3.out',
        }
      );

      // Framing lines contract and lock flush around the camera
      gsap.fromTo(
        frameBoxRef.current,
        {
          scale: 1.35,
          opacity: 0.2,
        },
        {
          scale: 1,
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

      // Text tracks upward cleanly into view
      gsap.fromTo(
        textRef.current,
        {
          y: 35,
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
      className="photo-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden select-none"
    >
      <div ref={textRef} className="space-y-2 max-w-xl will-change-transform">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          EDITORIAL OPTICS
        </span>
        <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Signature Photography
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Editorial candid timing, stage dynamics, and magazine-grade fine-art retouching capturing VIP interactions and decisive atmospheres.
        </p>
      </div>

      {/* Custom Transparent PNG Asset: Camera Body + Lens with Framing Reticle */}
      <div className="w-full md:w-auto flex items-center justify-center shrink-0">
        <div className="relative w-64 sm:w-80 max-w-[340px] aspect-[4/3] flex items-center justify-center p-2">
          {/* Viewfinder Framing Lines */}
          <div
            ref={frameBoxRef}
            className="absolute inset-2 border border-black/20 dark:border-white/25 rounded-xl pointer-events-none will-change-transform"
          >
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-black/50 dark:border-white/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-black/50 dark:border-white/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-black/50 dark:border-white/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-black/50 dark:border-white/60" />
          </div>

          <img
            ref={cameraImgRef}
            src={ASSET_CAMERA}
            alt="Loop Studios Signature Camera & Lens"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_25px_40px_rgba(255,255,255,0.08)] will-change-transform"
          />
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. EDITING & POST-PRODUCTION ANIMATION
// "VIRAL SHORT-FORM EDITING" slices horizontally with rapid dynamic cuts
// that assemble and lock into place over timeline tracks
// =========================================================================
export const EditingTimelineAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slice1Ref = useRef<HTMLDivElement | null>(null);
  const slice2Ref = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !slice1Ref.current || !slice2Ref.current || !timelineRef.current) return;

    const ctx = gsap.context(() => {
      // Horizontal slice 1 (from left)
      gsap.fromTo(
        slice1Ref.current,
        {
          x: -120,
          skewX: -15,
          opacity: 0,
        },
        {
          x: 0,
          skewX: 0,
          opacity: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      // Horizontal slice 2 (from right)
      gsap.fromTo(
        slice2Ref.current,
        {
          x: 120,
          skewX: 15,
          opacity: 0,
        },
        {
          x: 0,
          skewX: 0,
          opacity: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        }
      );

      // Timeline assembly
      gsap.fromTo(
        timelineRef.current,
        {
          scaleX: 0.7,
          opacity: 0.2,
        },
        {
          scaleX: 1,
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
      className="relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden select-none"
    >
      <div className="space-y-3 max-w-xl">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          TIMELINE ARCHITECTURE
        </span>

        {/* Sliced Dynamic Title */}
        <div className="overflow-hidden">
          <div ref={slice1Ref} className="will-change-transform">
            <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
              VIRAL SHORT-FORM
            </h3>
          </div>
          <div ref={slice2Ref} className="will-change-transform mt-0.5">
            <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-500 dark:text-slate-400">
              EDITING & RETENTION
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Sub-second visual hooks, kinetic animated subtitles, impact SFX placement, and seamless audio loops engineered to maximize algorithmic completion rates.
        </p>
      </div>

      {/* Keyframe Timeline Vector */}
      <div
        ref={timelineRef}
        className="w-48 sm:w-60 h-36 flex items-center justify-center shrink-0 will-change-transform"
      >
        <svg
          viewBox="0 0 200 130"
          fill="none"
          stroke="currentColor"
          className="w-full h-full text-slate-800 dark:text-slate-200"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="25" y="32" width="150" height="66" rx="4" />
          <line x1="25" y1="46" x2="175" y2="46" strokeWidth="1" />
          <line x1="45" y1="40" x2="45" y2="46" />
          <line x1="75" y1="36" x2="75" y2="46" strokeWidth="1.5" />
          <line x1="105" y1="40" x2="105" y2="46" />
          <line x1="135" y1="36" x2="135" y2="46" strokeWidth="1.5" />
          <line x1="165" y1="40" x2="165" y2="46" />

          <rect x="32" y="52" width="36" height="16" rx="2" className="fill-current opacity-20" />
          <rect x="72" y="52" width="48" height="16" rx="2" className="fill-current opacity-30" />
          <rect x="124" y="52" width="44" height="16" rx="2" className="fill-current opacity-20" />

          <path d="M 32 82 Q 40 74 48 82 T 64 82 T 80 82 T 96 82 T 112 82 T 128 82 T 144 82 T 168 82" />
          <line x1="72" y1="26" x2="72" y2="104" strokeWidth="2" className="stroke-current" />
          <polygon points="68,26 76,26 72,32" className="fill-current" />
        </svg>
      </div>
    </div>
  );
};
