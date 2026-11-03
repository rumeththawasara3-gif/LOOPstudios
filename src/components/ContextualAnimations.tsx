import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  STUDIO_PHOTO_DRONE,
  STUDIO_PHOTO_VR,
  STUDIO_PHOTO_GIMBAL,
  STUDIO_PHOTO_CAMERA,
} from '../types.ts';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 1. DRONE & AERIAL SECTION
// Generated Studio Photography: Cinema Drone
// Start: y: -140px, scale: 0.7, rotation: -12deg, opacity: 0
// End: y: 0, scale: 1, rotation: 0deg, opacity: 1
// =========================================================================
export const DroneAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const droneVisualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !droneVisualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Drone sweeps down, levels off, and scales up
      gsap.fromTo(
        droneVisualRef.current,
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
      className="drone-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      {/* Generated Studio Photography Visual: Cinema Drone (order-1 on mobile, order-2 on desktop) */}
      <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0">
        <div
          ref={droneVisualRef}
          className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden p-3 flex items-center justify-center will-change-transform"
        >
          {/* Studio Backdrop & Subtle Ambient Light */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.04] to-black/[0.08] dark:from-white/[0.03] dark:to-transparent rounded-2xl border border-black/10 dark:border-white/10" />

          {!imgError ? (
            <img
              src={STUDIO_PHOTO_DRONE}
              alt="Cinema Drone in Flight Studio Photography"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.08)] pointer-events-none"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-mono uppercase text-slate-400">Studio Drone Capture</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Narrative (order-2 on mobile, order-1 on desktop) */}
      <div ref={textRef} className="order-2 md:order-1 space-y-2 max-w-xl will-change-[transform,opacity,filter]">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          AERIAL KINETICS
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Drone & Scale Capture
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Fluid multi-axis altitude sweeps and high-altitude architectural venue perspectives deployed seamlessly by licensed pilots.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            4K 60P HDR
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            D-LOG M 10-BIT
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            WIND CLASS 5
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 360° & VR IMMERSION SECTION
// Generated Studio Photography: Spatial VR Headset
// Start: rotationY: 180deg, rotationZ: -10deg, scale: 0.75, opacity: 0
// End: rotationY: 0deg, rotationZ: 0deg, scale: 1, opacity: 1
// =========================================================================
export const VRHeadsetAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vrVisualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !vrVisualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // 3D Spatial rotation into normal view
      gsap.fromTo(
        vrVisualRef.current,
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
      className="vr-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      {/* Generated Studio Photography Visual: Spatial VR Headset (order-1 on mobile, order-2 on desktop) */}
      <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0">
        <div
          ref={vrVisualRef}
          className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden p-3 flex items-center justify-center will-change-transform"
          style={{ perspective: '1000px' }}
        >
          {/* Studio Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.04] to-black/[0.08] dark:from-white/[0.03] dark:to-transparent rounded-2xl border border-black/10 dark:border-white/10" />

          {!imgError ? (
            <img
              src={STUDIO_PHOTO_VR}
              alt="Spatial VR Headset Studio Photography"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.08)] pointer-events-none"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-mono uppercase text-slate-400">Spatial VR Immersion</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Narrative (order-2 on mobile, order-1 on desktop) */}
      <div ref={textRef} className="order-2 md:order-1 space-y-2 max-w-xl will-change-transform">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          SPATIAL RECORDING
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          360° VR Immersion
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Full-sphere event recordings enabling attendees and stakeholders to relive the venue in interactive 360° via mobile gyroscopes, desktop click-drag, or VR headsets.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            8K SPATIAL 360°
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            DUAL FISHEYE
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            SPATIAL AUDIO
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CINEMA VIDEOGRAPHY SECTION
// Generated Studio Photography: Cinema Camera on Motorized 3-Axis Gimbal
// Start: x: -120px, rotation: -18deg, filter: blur(8px), opacity: 0
// End: x: 0px, rotation: 0deg, filter: blur(0px), opacity: 1
// =========================================================================
export const CinemaGimbalAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gimbalVisualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !gimbalVisualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      // Glides across, stabilizes to level axis, and unblurs
      gsap.fromTo(
        gimbalVisualRef.current,
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
      className="video-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      {/* Generated Studio Photography Visual: Gimbal + Cinema Camera Rig (order-1 on mobile, order-2 on desktop) */}
      <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0">
        <div
          ref={gimbalVisualRef}
          className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-[220px] sm:h-[260px] md:h-[300px] rounded-2xl overflow-hidden p-3 flex items-center justify-center will-change-transform"
        >
          {/* Studio Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.04] to-black/[0.08] dark:from-white/[0.03] dark:to-transparent rounded-2xl border border-black/10 dark:border-white/10" />

          {!imgError ? (
            <img
              src={STUDIO_PHOTO_GIMBAL}
              alt="Cinema Camera Gimbal Rig Studio Photography"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.08)] pointer-events-none"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-mono uppercase text-slate-400">Cinema Stabilizer</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Narrative (order-2 on mobile, order-1 on desktop) */}
      <div ref={textRef} className="order-2 md:order-1 space-y-2 max-w-xl will-change-[filter,opacity,transform]">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          STABILIZED CINEMA
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Cinema Videography
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Fluid multi-axis mechanical stabilization, narrative highlight recaps, intentional anamorphic framing, and venue-grade audio calibration.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            3-AXIS GYRO STABILIZED
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            TITANIUM CARBON
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            ACTIVE TRACKING
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. SIGNATURE PHOTOGRAPHY SECTION
// Generated Studio Photography: Flagship Camera with Prime Lens & Framing Reticle
// Start: scale: 0.75, rotation: 14deg, filter: blur(10px), opacity: 0
// End: scale: 1, rotation: 0deg, filter: blur(0px), opacity: 1, framing snap
// =========================================================================
export const OpticsSnapAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cameraVisualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !cameraVisualRef.current || !textRef.current || !frameBoxRef.current) return;

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
        cameraVisualRef.current,
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
      className="photo-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      {/* Generated Studio Photography Visual: Flagship Camera & Optical Lens (order-1 on mobile, order-2 on desktop) */}
      <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-center shrink-0">
        <div
          ref={cameraVisualRef}
          className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden p-3 flex items-center justify-center will-change-transform"
        >
          {/* Studio Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.04] to-black/[0.08] dark:from-white/[0.03] dark:to-transparent rounded-2xl border border-black/10 dark:border-white/10" />

          {/* Viewfinder Framing Lines */}
          <div
            ref={frameBoxRef}
            className="absolute inset-3 border border-black/20 dark:border-white/25 rounded-xl pointer-events-none z-20 will-change-transform"
          >
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-black/50 dark:border-white/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-black/50 dark:border-white/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-black/50 dark:border-white/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-black/50 dark:border-white/60" />
          </div>

          {!imgError ? (
            <img
              src={STUDIO_PHOTO_CAMERA}
              alt="Signature Optics Camera Studio Photography"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.08)] pointer-events-none"
            />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-mono uppercase text-slate-400">Signature Optics</span>
            </div>
          )}
        </div>
      </div>

      {/* Text Narrative (order-2 on mobile, order-1 on desktop) */}
      <div ref={textRef} className="order-2 md:order-1 space-y-2 max-w-xl will-change-transform">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          EDITORIAL OPTICS
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Signature Photography
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Editorial candid timing, stage dynamics, and magazine-grade fine-art retouching capturing VIP interactions and decisive atmospheres.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            FULL-FRAME 45MP
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            f/1.2 PRIME GLASS
          </span>
          <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            14-BIT RAW
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. EDITING & POST-PRODUCTION ANIMATION
// "VIRAL SHORT-FORM EDITING" slices horizontally with rapid dynamic cuts
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="editing-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      {/* Sliced Kinetic Typography Display & Dynamic Timeline Graphic (order-1 on mobile, order-2 on desktop) */}
      <div className="order-1 md:order-2 w-full md:w-auto flex flex-col items-center justify-center shrink-0">
        <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col justify-between bg-black/[0.04] dark:bg-white/[0.02] border border-black/10 dark:border-white/10">
          {/* Sliced Kinetic Typography */}
          <div className="relative pt-2 space-y-1">
            <div
              ref={slice1Ref}
              className="text-base sm:text-lg md:text-xl font-display font-black tracking-tight text-[#0A0A0C] dark:text-white uppercase leading-none will-change-transform"
            >
              VIRAL SHORT-FORM
            </div>
            <div
              ref={slice2Ref}
              className="text-base sm:text-lg md:text-xl font-display font-black tracking-tight text-blue-600 dark:text-blue-400 uppercase leading-none will-change-transform"
            >
              RETENTION PACING
            </div>
          </div>

          {/* Slicing Playhead & Timeline Tracks */}
          <div ref={timelineRef} className="space-y-2 pt-4 will-change-transform origin-left">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 dark:text-slate-400">
              <span>00:00:03:12</span>
              <span className="text-emerald-500 font-semibold">HOOK PEAK · 88%</span>
            </div>

            {/* Video track */}
            <div className="h-4 rounded bg-black/10 dark:bg-white/10 relative overflow-hidden flex items-center px-2">
              <div className="w-1/3 h-full bg-blue-500/30 rounded-sm" />
              <div className="w-1/4 h-full bg-purple-500/30 rounded-sm ml-1" />
              <div className="w-1/3 h-full bg-emerald-500/30 rounded-sm ml-1" />
              {/* Playhead red line */}
              <div className="absolute top-0 bottom-0 left-[48%] w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </div>

            {/* Audio waveform track */}
            <div className="h-3 rounded bg-black/5 dark:bg-white/5 flex items-center gap-0.5 px-2">
              {[4, 8, 12, 6, 14, 10, 4, 16, 8, 12, 14, 6, 10, 16, 12, 8, 4].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 bg-slate-400 dark:bg-slate-500 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text Narrative (order-2 on mobile, order-1 on desktop) */}
      <div className="order-2 md:order-1 space-y-2 max-w-xl">
        <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400">
          RETENTION SCIENCE
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0C] dark:text-white">
          Short-Form Video Editing
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Frame-by-frame pacing, kinetic animated subtitles, impact SFX, and psychological hooks engineered specifically to prevent user swipe-away.
        </p>
      </div>
    </div>
  );
};
