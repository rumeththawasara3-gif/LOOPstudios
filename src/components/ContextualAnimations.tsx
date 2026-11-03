import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DroneRadarHUD,
  SpatialGyroHUD,
  CinemaCameraHUD,
  RetentionWaveformHUD,
} from './CinemaHUDs.tsx';

gsap.registerPlugin(ScrollTrigger);

// =========================================================================
// 1. DRONE & AERIAL SECTION
// Director HUD: Drone Flight Radar Grid, Altitude Telemetry, Compass Rings
// Start: y: -120px, scale: 0.75, rotation: -10deg, opacity: 0
// End: y: 0, scale: 1, rotation: 0deg, opacity: 1 (scrub: 1)
// =========================================================================
export const DroneAnimationBlock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          y: -120,
          scale: 0.75,
          rotation: -10,
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
            onUpdate: (self) => {
              setRotation(self.progress * 360);
            },
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        {
          y: 35,
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
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <DroneRadarHUD scrollRotation={rotation} />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity,filter]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
          AERIAL RECON // PILOT DIRECTIVE
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Drone & Scale Capture
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Fluid multi-axis altitude sweeps, radar-coordinated flight corridors, and high-altitude architectural venue perspectives deployed seamlessly by licensed pilots.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
            4K 60P HDR
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            D-LOG M 10-BIT
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            RADAR RADIAL SYNC
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 360° & VR IMMERSION SECTION
// Director HUD: Rotating Geometric 3D Wireframe Gyro-Sphere
// Start: rotateY: 180, scale: 0.75, opacity: 0
// End: rotateY: 0, scale: 1, opacity: 1 (scrub: 1)
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
          rotateY: 90,
          scale: 0.8,
          opacity: 0,
          transformPerspective: 1000,
        },
        {
          rotateY: 0,
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
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <SpatialGyroHUD />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-purple-400 uppercase font-semibold">
          SPATIAL COMPUTING // 360° FIELD
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          360° VR Immersion
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Relive your flagship event from any spatial coordinate. Viewers can freely look around via mobile gyroscopes, desktop interaction, or full Apple Vision Pro & Meta Quest 3 stereoscopic immersion.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-purple-400">
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 font-bold">
            8K EQUIRECTANGULAR
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            GYROSCOPE SYNC
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
            HEADSET READY
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CINEMA VIDEOGRAPHY & GIMBAL SECTION
// Director HUD: ARRI/RED Anamorphic Scope, Audio VU Meters, Ticking Timecode
// Start: x: -90px, scale: 0.8, opacity: 0
// End: x: 0, scale: 1, opacity: 1 (scrub: 1)
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
          x: -90,
          scale: 0.8,
          opacity: 0,
        },
        {
          x: 0,
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
          x: 35,
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
      className="video-block relative p-6 sm:p-8 rounded-2xl editorial-glass flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden select-none"
    >
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <CinemaCameraHUD />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-cyan-400 uppercase font-semibold">
          OPTICAL RIG // 2.39:1 SCOPE
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Cinema Videography & Recap Films
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          3-axis motorized gimbal stabilization, deliberate anamorphic lens selections, stage-matched color profiles, and 32-bit float audio multi-track recording.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-400">
          <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
            PRORES 4444 XQ
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
// Director HUD: Anamorphic Prime Frame & Color Calibration Telemetry
// Start: scale: 1.25, opacity: 0
// End: scale: 1, opacity: 1 (scrub: 1)
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
          scale: 1.2,
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
      <div className="order-1 md:order-2 w-full md:w-[48%] flex items-center justify-center shrink-0">
        <div ref={visualRef} className="w-full will-change-transform">
          <CinemaCameraHUD />
        </div>
      </div>

      <div ref={textRef} className="order-2 md:order-1 space-y-3 max-w-xl will-change-[transform,opacity]">
        <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-purple-400 uppercase font-semibold">
          SIGNATURE STILLS // 45MP SENSOR
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white cinema-gradient-text">
          Signature Event Photography
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Fine-art event photography delivering uncompressed RAW assets and master editorial retouches calibrated for keynote speakers, audience energy, and stage lighting.
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
// Director HUD: Retention Waveform & Timeline Playhead Slices
// =========================================================================
export const EditingTimelineAnimationBlock: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl editorial-glass p-4 sm:p-6 select-none overflow-hidden border border-cyan-500/20">
      <div className="mb-3 flex items-center justify-between text-xs font-mono text-cyan-400">
        <span className="font-bold tracking-wider">POST-PRODUCTION TELEMETRY // REAL-TIME SCRUBBER</span>
        <span className="text-[10px] text-slate-400">SUB-SECOND HOOK CUT CADENCE</span>
      </div>
      <RetentionWaveformHUD />
    </div>
  );
};
